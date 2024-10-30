import express from 'express';
import { authenticateUser } from './middlewares/authMiddleware.js';
const router = express.Router();

import { pageIndex } from './controllers/pageController.js';
import {
  productCategory,
  productDisplay,
  productCart,
  productCheckout,
  addToCart,
  updateCartItem,
  removeCartItem,
} from './controllers/productController.js';
import {
  authRegister,
  authVerifyEmail,
  authSendEmailVerification,
  authLogin,
  authLogout,
  authChangePassword,
  authResetPasswordRequest,
  authResetPasswordRequestPage,
  authResetPasswordFormPage,
  authSetNewResetPassword
} from './controllers/authController.js';
import {
  accountRegister,
  accountLogin,
  accountChangePassword,
  accountPage,
  accountAddresses,
  accountAddAddress,
  accountUpdateAddress,
  accountRemoveAddress
} from './controllers/accountController.js';

// General
router.get('/', pageIndex);

// Account
router.get('/login', accountLogin);
router.get('/register', accountRegister);
router.get('/account', authenticateUser(true), accountPage);
router.get('/account/addresses', authenticateUser(true), accountAddresses);
router.get('/account/change-password', authenticateUser(true), accountChangePassword);

// Account API
router.post('/api/addresses/add', accountAddAddress);
router.post('/api/addresses/update', accountUpdateAddress);
router.post('/api/addresses/remove', accountRemoveAddress);

// Products
router.get('/category/:id', productCategory);
router.get('/product/:id', productDisplay);
router.get('/cart', productCart);
router.get('/checkout', productCheckout);
// router.get('/checkout/order', productCheckoutPayment);
// router.get('/checkout/confirmation', productCheckoutConfirmation);

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
router.get('/reset-password-request', authResetPasswordRequestPage);
router.post('/api/auth/reset-password-request', authResetPasswordRequest);
router.get('/reset-password/:token', authResetPasswordFormPage);
router.post('/api/auth/reset-password/:token', authSetNewResetPassword);

export default router;