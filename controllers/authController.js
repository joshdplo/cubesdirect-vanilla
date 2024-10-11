const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

const NAME = process.env.NAME || 'New Server';

// JWT Secret and Expiration
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRATION = '1h';

// Register
//@TODO: validate user data
exports.authRegister = async (req, res, next) => {
  const { email, password } = req.body;

  // Make sure we received email and password
  if (!email || !password) {
    res.status(500);
    next();
  }

  try {
    // Check if User Exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create new user
    user = new User({ email, password });

    // Hash the Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Generate email verification token
    const verificationToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    user.verificationToken = verificationToken;

    // Save User to DB
    await user.save();

    // Send verification email
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
      subject: `${NAME} Email Verification`,
      text: `Please click the following link to verify your ${NAME} account email address: \n\n http://${req.headers.host}/api/auth/verify-email/${verificationToken}`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        res.status(500);
        next();
      }

      res.json({ msg: 'Verification Link sent to email' });
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Verify Email
exports.authVerifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json({ msg: 'Invalid token (user not found)' });
    if (user.isVerified) return res.status(400).json({ msg: 'User already verified' });

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = '';
    await user.save();

    res.json({ msg: 'Email successfully verified' });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Login
//@TODO: validate user data
exports.authLogin = async (req, res, next) => {
  const { email, password } = req.body;

  // Make sure we received email and password
  if (!email || !password) {
    res.status(500);
    next();
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check if account is locked
    // @TODO: implement account unlock if needed (can just do it in the database)
    if (user.isLocked) return res.status(403).json({ msg: 'Account is locked due to too many failed login attempts. Contact the admin.' });

    // Check if email is verified
    // @TODO: implement 'resend verification email'
    if (!user.isVerified) return res.status(400).json({ msg: 'Please verify your email before logging in' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Lock account if too many failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        await user.save();
        return res.status(403).json({ msg: 'Account is locked due to too many failed login attempts. Contact the admin.' });
      }

      await user.save();
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      user: { id: user.id }
    };
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// REset Password
//@TODO: validate user data
exports.authResetPassword = async (req, res, next) => {
  const { email } = req.body;

  // Make sure we received email
  if (!email) {
    res.status(500);
    next();
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // Create reset tokeny and expiry
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
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
        res.status(500);
        next();
      }

      res.json({ msg: 'Password Reset Link sent to email' });
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

module.exports = router;