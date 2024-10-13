const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const stringUtils = require('../util/string-utils');

// Helpers
const isDevelopment = process.env.NODE_ENV !== 'production';
const NAME = process.env.NAME;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1h';

// Register (POST)
exports.authRegister = async (req, res, next) => {
  const { email, password } = req.body;

  // Make sure email and password are valid
  //@TODO: move this to be re-usable
  if (!stringUtils.validateEmail(email).valid) {
    return res.status(400).json({ error: 'Email is invalid' });
  }
  if (!stringUtils.validatePasswords(password, password).valid) {
    return res.status(400).json({ error: 'Password is invalid' });
  }

  try {
    // Check if User Exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      //@TODO: better error message (no brute force email checking)
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({ email, password: hashedPassword });

    // Generate verification token
    const verificationToken = jwt.sign({ id: newUser.id, email: newUser.email, roles: newUser.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    // Verification Email (PROD ONLY)
    //@TODO: mock this up with a modal in dev mode? ie. send the verification link through and have user click it
    if (!isDevelopment) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        to: newUser.email,
        from: process.env.EMAIL_USER,
        subject: `${NAME} Email Verification`,
        text: `Please click the following link to verify your ${NAME} account email address: \n\n http://${req.headers.host}/api/auth/verify-email/${verificationToken}`
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).json({ error: 'sendmail failed' });
        }

        res.json({ message: 'Verification Link sent to email' });
      });
    } else {
      res.cookie('token', verificationToken, { httpOnly: true });
      //@TODO: this can be cleaned up. can use req.get('Referrer') from the login page (pageLogin controller) (will need to check if it is on current domain; if not, redirect to home or account) 
      res.json({ success: true, redirect: '/account', message: 'Registration successful' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Verify Email (GET?)
//@TODO: implement verify email (this is a GET route)
exports.authVerifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;//@TODO: set up get token from params
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);//@TODO: update to sequelize

    if (!user) return res.status(400).json({ error: 'Invalid token (user not found)' });
    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = '';
    await user.save();

    res.json({ message: 'Email successfully verified' });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Login (POST)
exports.authLogin = async (req, res, next) => {
  const { email, password } = req.body;

  // Make sure email and password are valid
  //@TODO: move this to be re-usable
  if (!stringUtils.validateEmail(email).valid) {
    return res.status(400).json({ error: 'Email is invalid' });
  }
  if (!stringUtils.validatePasswords(password, password).valid) {
    return res.status(400).json({ error: 'Password is invalid' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Check if account is locked
    // @TODO: implement account unlock if needed (can just do it in the database)
    if (user.isLocked) return res.status(403).json({ error: 'Account is locked due to too many failed login attempts. Contact the admin.' });

    // Check if email is verified
    // @TODO: implement email verification
    // @TODO: implement 'resend verification email'
    //if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email before logging in' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Lock account if too many failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        await user.save();
        return res.status(403).json({ error: 'Account is locked due to too many failed login attempts. Contact the admin.' });
      }

      await user.save();
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT Token
    const token = jwt.sign({ id: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    // Set cookie and redirect
    res.cookie('token', token, { httpOnly: true });
    //@TODO: this can be cleaned up. can use req.get('Referrer') from the login page (pageLogin controller) (will need to check if it is on current domain; if not, redirect to home or account) 
    res.json({ success: true, redirect: '/', message: 'Login successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
};

// Reset Password (POST)
//@TODO: implement reset password
exports.authResetPassword = async (req, res, next) => {
  const { email } = req.body;

  //@TODO: validate password

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // Create reset tokeny and expiry
    const resetToken = jwt.sign({ id: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: '15m' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: `${NAME} Password Reset`,
      text: `We have recieved a password reset request for your ${NAME} account. If you did not send this password reset request, please take caution.\n\n Click the following link to reset your password:\n\n http://${req.headers.host}/reset/${resetToken}`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(error.message);
        res.status(500).json({ error });
      }

      res.json({ msg: 'Password Reset Link sent to email' });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
};

// Change Password (POST)
exports.authChangePassword = async (req, res, next) => {
  const { userId, currentPassword, newPassword, newPasswordConfirm } = req.body;

  // Make sure passwords are valid
  //@TODO: move this to be re-usable
  const validatedCurrentPassword = stringUtils.validatePasswords(currentPassword, currentPassword);
  const validatedNewPassword = stringUtils.validatePasswords(newPassword, newPasswordConfirm);

  if (!validatedCurrentPassword.valid) return res.status(400).json({ error: validatedCurrentPassword.message });
  if (!validatedNewPassword.valid) return res.status(400).json({ error: validatedNewPassword.message });

  try {
    const user = await User.findOne({ where: { id: userId || req.user.id } });
    if (!user) return res.status(400).json({ error: 'User does not exist' });

    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordMatch) return res.status(400).json({ error: 'Current password does not match' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Check if new pass is same as old pass
    const isDuplicatePassword = await bcrypt.compare(user.password, hashedPassword);
    if (isDuplicatePassword) return res.status(400).json({ error: 'New password can not be the same as current password' });

    // Save new pass
    user.password = hashedPassword;
    await user.save();

    // Log the user out and send json with redirect key
    res.clearCookie('token');
    return res.json({ success: true, redirect: '/login', message: 'Password change successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
};

// Logout (GET)
exports.authLogout = (req, res, next) => {
  res.clearCookie('token');
  res.redirect('/');
};