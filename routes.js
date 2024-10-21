import express from 'express';
import authenticateUser from './middlewares/authMiddleware.js';
const router = express.Router();

import { pageIndex } from './controllers/pageController.js';
import {
  productCategory,
  productDisplay,
  addToCart
} from './controllers/productController.js';
import {
  authRegister,
  authVerifyEmail,
  authSendEmailVerification,
  authLogin,
  authResetPassword,
  authChangePassword,
  authLogout
} from './controllers/authController.js';
import {
  accountPage,
  accountRegister,
  accountLogin,
  accountResetPassword,
  accountChangePassword,
} from './controllers/accountController.js';

// General
router.get('/', authenticateUser(false), pageIndex);

// Account
router.get('/login', authenticateUser(false), accountLogin);
router.get('/register', authenticateUser(false), accountRegister);
router.get('/account', authenticateUser(true), accountPage);
router.get('/reset-password', authenticateUser(false), accountResetPassword);
router.get('/account/change-password', authenticateUser(true), accountChangePassword);

// Products
router.get('/category/:id', authenticateUser(false), productCategory);
router.get('/product/:id', authenticateUser(false), productDisplay);
router.post('/api/cart', authenticateUser(false), addToCart);

// Auth API
router.post('/api/auth/register', authRegister);
router.post('/api/auth/login', authLogin);
router.get('/api/auth/verify-email/:token', authVerifyEmail);
router.post('/api/auth/send-email-verification', authSendEmailVerification);
router.post('/api/auth/reset-password', authResetPassword);
router.post('/api/auth/change-password', authChangePassword);
router.get('/logout', authLogout);

export default router;