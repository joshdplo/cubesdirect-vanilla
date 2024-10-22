import express from 'express';
import { authenticateUser } from './middlewares/authMiddleware.js';
const router = express.Router();

import { pageIndex } from './controllers/pageController.js';
import {
  productCategory,
  productDisplay,
  productCart,
  addToCart,
  updateCartItem,
  removeCartItem
} from './controllers/productController.js';
import {
  authRegister,
  authVerifyEmail,
  authSendEmailVerification,
  authLogin,
  authLogout,
  authChangePassword,
  authResetPasswordRequest,
  authResetPasswordForm,
  authSetNewResetPassword
} from './controllers/authController.js';
import {
  accountPage,
  accountRegister,
  accountLogin,
  accountResetPasswordRequest,
  accountChangePassword,
} from './controllers/accountController.js';

// General
router.get('/', pageIndex);

// Account
router.get('/login', accountLogin);
router.get('/register', accountRegister);
router.get('/account', authenticateUser(true), accountPage);
router.get('/account/change-password', authenticateUser(true), accountChangePassword);
router.get('/reset-password-request', accountResetPasswordRequest);

// Products
router.get('/category/:id', productCategory);
router.get('/product/:id', productDisplay);
router.get('/cart', productCart);

// Products API
router.post('/api/cart/add', addToCart);
router.post('/api/cart/update', updateCartItem);
router.post('/api/cart/remove', removeCartItem);

// Auth API General
router.post('/api/auth/register', authRegister);
router.post('/api/auth/login', authLogin);
router.get('/logout', authLogout);
router.get('/api/auth/verify-email/:token', authVerifyEmail);
router.post('/api/auth/send-email-verification', authSendEmailVerification);
router.post('/api/auth/change-password', authChangePassword);

// Auth API Reset Password
router.post('/api/auth/reset-password-request', authResetPasswordRequest);
router.get('/reset-password/:token', authResetPasswordForm);
router.post('/api/auth/reset-password/:token', authSetNewResetPassword);

export default router;