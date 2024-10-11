const express = require('express');
const router = express.Router();
const {
  pageIndex,
  pageRegister,
  pageLogin,
  pageResetPassword,
  pageChangePassword,
} = require('./controllers/pageController');
const {
  productCategory
} = require('./controllers/productController');
const {
  authRegister,
  authVerifyEmail,
  authLogin,
  authResetPassword
} = require('./controllers/authController');

// General
router.get('/', pageIndex);
router.get('/login', pageLogin);
router.get('/register', pageRegister);
router.get('/reset-password', pageResetPassword);

// Products
router.get('/category/:name', productCategory);

// Auth API
router.post('/api/auth/register', authRegister);
router.post('/api/auth/login', authLogin);
router.get('/api/auth/verify-email', authVerifyEmail);
router.post('/api/auth/reset-password', authResetPassword);


module.exports = router;