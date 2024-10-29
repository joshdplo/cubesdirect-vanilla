import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { sendEmail } from '../services/emailService.js';
import User from '../models/User.js';
import extractFields from '../validation/extractFields.js';
import { userSchema } from '../validation/userSchema.js';
import { addMessage } from '../middlewares/globalMessageMiddleware.js';
import {
  loginUser,
  logoutUser,
  issueToken
} from '../util/jwtUtils.js';
import { mergeGuestCartWithUserCart } from './productController.js';

// Helpers
const isEmailEnabled = process.env.EMAIL_ENABLED === 'true';
const { NAME } = process.env;

// Register (POST)
export const authRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cartToken = req.cartToken;

    // Joi validation
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
    if (isEmailEnabled) {
      const verificationToken = issueToken({ id: newUser.id }, 'email');
      const verificationLink = `http://${req.headers.host}/api/auth/verify-email/${verificationToken}`;

      await sendEmail({
        to: newUser.email,
        subject: `Welcome to ${NAME}!`,
        text: `Welcome to ${NAME}, ${newUser.email}!\nYour account has been created successfully. We hope you enjoy your time on ${NAME} and find the cube of your dreams!\n\nTo verify your email, click this link: ${verificationLink}.`
      });
    }

    // Log user in
    loginUser(res, newUser);
    addMessage(req, 'Registration successful', 'success');

    // If we have a guest cart, merge them and clear the cookie
    if (cartToken) {
      console.log('Merging guest cart with user cart on register and then clearing the cartToken cookie...');
      await mergeGuestCartWithUserCart(newUser.id, cartToken);
      res.clearCookie('cartToken');
    }

    res.json({ success: true, redirect: '/account', cartMerged: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
};

// Login (POST)
export const authLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cartToken = req.cartToken;

    // Joi validation
    const schema = extractFields(userSchema, ['email', 'password']);
    const { error, value } = schema.validate({ email, password });

    if (error) {
      console.error(`Error with Joi validation in controller:`, error);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email: value.email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Check if account is locked
    // @TODO: implement account unlock if needed (can just do it in the database)
    if (user.isLocked) return res.status(403).json({ error: 'Account is locked due to too many failed login attempts. Contact the admin.' });

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
    addMessage(req, 'Logged in successfully', 'success');

    // If we have a guest cart, merge them and clear the cookie
    if (cartToken) {
      console.log('Merging guest cart with user cart on login and then clearing the cartToken cookie...');
      await mergeGuestCartWithUserCart(user.id, cartToken);
      res.clearCookie('cartToken');
    }

    res.json({ success: true, redirect: '/', cartMerged: true, message: 'Login successful' });
  } catch (error) {
    console.error(error.message, error);
    res.status(500).json({ error });
  }
};

// Logout (GET)
export const authLogout = (req, res, next) => {
  logoutUser(res);
  addMessage(req, 'Logged out successfully', 'success');
  res.redirect('/');
};

// Verify Email (GET)
export const authVerifyEmail = async (req, res, next) => {
  try {
    if (!isEmailEnabled) {
      const error = new Error('Email is disabled');
      error.status = 500;
      return next(error);
    };

    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }
    if (user.isVerified) {
      const error = new Error('User is already verified');
      error.status = 400;
      return next(error);
    }

    // Update user verification status and save user
    user.isVerified = true;
    await user.save();

    // Log user in and redirect to account page
    loginUser(res, user);
    addMessage(req, 'Successfully verified email', 'success');
    res.redirect('/account');
  } catch (error) {
    console.error(error.message, error);
    if (error.name === 'TokenExpiredError') {
      error.message = 'The verification link has expired. Visit your account page to send a new verification email.';
      error.status = 400;
    } else if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid verification link.';
      error.status = 400;
    } else {
      error.message = 'An unexpected error occurred.';
      error.status = 500;
    }
    next(error);
  }
};

// Send Verification Email (POST)
//@TODO: retest this (using req.user.id instead of sending it through the page with req.body.user.id)
export const authSendEmailVerification = async (req, res, next) => {
  try {
    if (!isEmailEnabled) return res.status(500).json({ error: 'Email is disabled' });

    const userId = req.user?.id;
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'User Already verified' });

    // Check if email was sent recently
    const lastSent = req.session.lastVerificationEmailSent;
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (lastSent && Date.now() - lastSent < FIVE_MINUTES) {
      const timeLeft = Math.ceil((FIVE_MINUTES - (Date.now() - lastSent)) / 1000);
      return res.status(429).json({ error: `Please wait 5 minutes before requesting another verification email (${timeLeft} seconds remaining).` });
    }

    // Generate verification token and send email, then set last sent
    const verificationToken = issueToken(user, 'email');
    const verificationLink = `http://${req.headers.host}/api/auth/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: `Verify Your ${NAME} Email`,
      text: `Click the below link to verify your ${NAME} email:\n${verificationLink}`
    });

    req.session.lastVerificationEmailSent = Date.now();
    res.status(200).json({ message: 'Verification email has been sent' });
  } catch (error) {
    console.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
};

// Change Password (POST)
export const authChangePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;
    const userId = req.user?.id;

    // Joi validation
    const schema = extractFields(userSchema, ['password', 'newPassword']);
    const { error, value } = schema.validate({ password, newPassword });

    if (error) {
      console.error(`Error with Joi validation in controller:`, error);
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(400).json({ error: 'User does not exist' });

    const isCurrentPasswordMatch = await bcrypt.compare(value.password, user.password);
    if (!isCurrentPasswordMatch) return res.status(400).json({ error: 'Current password does not match' });

    // Check if new pass is same as old pass
    const isDuplicatePassword = await bcrypt.compare(value.newPassword, user.password);
    if (isDuplicatePassword) return res.status(400).json({ error: 'New password cannot be the same as current password' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(value.newPassword, salt);

    // Save new pass
    user.password = hashedNewPassword;
    await user.save();

    // Send Email
    if (isEmailEnabled) {
      await sendEmail({
        to: user.email,
        subject: `Your ${NAME} password has changed`,
        text: `Hello ${user.email}!\n\nYour ${NAME} password has changed. If you changed your password, you can now log in with your new password.\n\nIf you did not change your password, you can reset your password at this link: http://${req.headers.host}/reset-password-request`
      })
    }

    // Log the user out and send json with redirect key
    logoutUser(res);
    addMessage(req, 'Password successfully changed. Please log in again.', 'success');
    return res.json({ success: true, redirect: '/login', message: 'Password change successful' });
  } catch (error) {
    console.error(error.message, error);
    res.status(500).json({ error });
  }
};

// Reset Password (POST)
export const authResetPasswordRequest = async (req, res, next) => {
  const successMessage = 'Password Reset request sent. If your email address is associated with an account, you should receive an email shortly. If you do not receive an email, double-check your email was entered correctly and try again.';

  try {
    if (!isEmailEnabled) return res.status(500).json({ error: 'Email is not enabled' });

    const { email } = req.body;

    // Joi validation
    const schema = extractFields(userSchema, ['email']);
    const { error, value } = schema.validate({ email });

    if (error) {
      console.error(`Error with Joi validation in controller:`, error);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if email was sent recently
    const lastSent = req.session.lastPasswordResetEmailSent;
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (lastSent && Date.now() - lastSent < FIVE_MINUTES) {
      const timeLeft = Math.ceil((FIVE_MINUTES - (Date.now() - lastSent)) / 1000);
      return res.status(429).json({ error: `Please wait 5 minutes before requesting another password reset (${timeLeft} seconds remaining).` });
    }

    // Check if user exists
    // - don't reveal to user if the email is associated with an
    //   account, send generic success even if user not found
    const user = await User.findOne({ where: { email: value.email } });
    req.session.lastPasswordResetEmailSent = Date.now();

    console.error(`USER ${value.email} NOT FOUND`);
    if (!user) return res.status(200).json({ success: true, message: successMessage });

    // Generate reset token and set expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();
    const resetLink = `http://${req.headers.host}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: `${NAME} Password Reset Request`,
      text: `A Password reset for your ${NAME} account has been requested.\nPlease click the below link to reset your password:\n${resetLink}`
    });

    res.status(200).json({ success: true, message: successMessage });
  } catch (error) {
    console.error(error.message, error);
    res.status(500).json({ error });
  }
};

// Reset Password Form (GET)
export const authResetPasswordForm = async (req, res, next) => {
  try {
    if (!isEmailEnabled) {
      addMessage(req, 'Email is not enabled, redirected to home page', 'error');
      return res.redirect('/');
    }

    const { token } = req.params;
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      console.error(`USER NOT FOUND IN authResetPasswordForm: Invalid or expired reset token.`);
      const error = new Error('Invalid or expired reset token.');
      error.status = 400;
      return next(error);
    }

    res.render('pages/account/reset-password-form', {
      title: 'Reset Password',
      bundle: 'account',
      token
    });
  } catch (error) {
    console.error(error.message, error);
    next(error);
  }
};

// Set New Password Reset Password (POST)
export const authSetNewResetPassword = async (req, res, next) => {
  if (!isEmailEnabled) return res.status(500).json({ error: 'email is not enabled' });

  try {
    const { token } = req.params;
    const { password } = req.body;

    // Joi validation
    const schema = extractFields(userSchema, ['password']);
    const { error, value } = schema.validate({ password });

    if (error) {
      console.error(`Error with Joi validation in controller:`, error);
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      console.error(`USER NOT FOUND IN authSetNewResetPassword: Invalid or expired reset token.`);
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    // set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(value.password, salt);

    // clear password reset token and expiry
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: `${NAME} Password Reset Successful`,
      text: `You have successfully reset your ${NAME} password. You can now log in with your new password.`
    });

    addMessage(req, 'Password reset successful. You can now log in with your new password.', 'success');
    res.json({ success: true, redirect: '/login', message: 'Password Reset Successful' });
  } catch (error) {
    console.error(error.message, error);
    res.status(500).json({ error });
  }
}