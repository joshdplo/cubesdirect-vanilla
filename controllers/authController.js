import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import extractFields from '../validation/extractFields.js';
import { userSchema } from '../validation/userSchema.js';
import stringUtils from '../util/stringUtils.js';
import { setMessage } from '../middlewares/messageMiddleware.js';
import {
  loginUser,
  logoutUser,
  issueToken
} from '../util/jwtUtils.js';

// Helpers
const isEmailEnabled = process.env.EMAIL_ENABLED === 'true';
const { NAME } = process.env;

// Register (POST)
export const authRegister = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Joi validation: extract and validate only email + password fields from userSchema
    const schema = extractFields(userSchema, ['email', 'password']);
    const { error, value } = schema.validate({ email, password });

    if (error) {
      console.error(`Error with Joi validation in controller:`, error);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if User Exists
    const existingUser = await User.findOne({ where: { email: value.email } });
    if (existingUser) {
      console.log('USER ALREADY EXISTS');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    // Create new user
    const newUser = await User.create({ email: value.email, password: hashedPassword });

    // Verification Email
    //@TODO: verification email (use jwtUtils)
    if (isEmailEnabled) {
      const accessToken = issueToken(newUser, 'access');

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
        text: `Please click the following link to verify your ${NAME} account email address: \n\n http://${req.headers.host}/api/auth/verify-email/${accessToken}`
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).json({ error: 'sendmail failed' });
        }

        res.json({ message: 'Verification Link sent to email' });
      });
    } else {
      loginUser(res, newUser);
      setMessage(req, 'Registration successful', 'success');

      //@TODO: this can be cleaned up. can use req.get('Referrer') from the login page (pageLogin controller) (will need to check if it is on current domain; if not, redirect to home or account) 
      res.json({ success: true, redirect: '/account', message: 'Registration successful' });
    }
  } catch (error) {
    console.error(error.message);
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Verify Email (GET?)
//@TODO: implement verify email (this is a GET route)
export const authVerifyEmail = async (req, res, next) => {
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
export const authLogin = async (req, res, next) => {
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
    // @TODO: implement 'resend verification email' (on the /verify-email page)
    if (isEmailEnabled && !user.isVerified) {
      console.log('User is registered but not verified - redirecting to /verify-email');
      res.redirect('/verify-email');
    }

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

    // Login user with JWT
    loginUser(res, user);

    //@TODO: this can be cleaned up. can use req.get('Referrer') from the login page (pageLogin controller) (will need to check if it is on current domain; if not, redirect to home or account) 
    res.json({ success: true, redirect: '/', message: 'Login successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
};

// Reset Password (POST)
//@TODO: implement reset password (needs full refactor)
export const authResetPassword = async (req, res, next) => {
  res.status(500).json({ error: 'authResetPassword not implemented yet' });
};

// Change Password (POST)
export const authChangePassword = async (req, res, next) => {
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
    logoutUser(res);
    return res.json({ success: true, redirect: '/login', message: 'Password change successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
};

// Logout (GET)
//@TODO: update FE script to use json instead of relying on BE redirect
export const authLogout = (req, res, next) => {
  logoutUser(res);
  return res.json({ success: true, redirect: '/', message: 'Successfully logged out' });
};