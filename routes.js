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
  authRegister,
  authVerifyEmail,
  authLogin,
  authResetPassword,
  authChangePassword,
  authLogout
} = require('./controllers/authController');
const { accountPage } = require('./controllers/accountController');
const { productCategory } = require('./controllers/productController');

// General
router.get('/', pageIndex);
router.get('/login', pageLogin);
router.get('/register', pageRegister);
router.get('/reset-password', pageResetPassword);
router.get('/change-password', pageChangePassword);

// Account
router.get('/account', accountPage);

// Products
router.get('/category/:name', productCategory);

// Auth API
router.post('/api/auth/register', authRegister);
router.post('/api/auth/login', authLogin);
router.get('/api/auth/verify-email', authVerifyEmail);
router.post('/api/auth/reset-password', authResetPassword);
router.post('/api/auth/change-password', authChangePassword);
router.get('/logout', authLogout);

// Testing
router.post('/api/test', (req, res, next) => {
  console.log('GOT POST REQUEST ON /API/TEST:');
  console.log(req.body);

  res.json({ have: 'a', good: 'day' });
});

module.exports = router;