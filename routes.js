const express = require('express');
const router = express.Router();
const { pageIndex } = require('./controllers/pageController');
const { productCategory } = require('./controllers/productController');
const {
  authRegister,
  authVerifyEmail,
  authLogin,
  authResetPassword,
  authChangePassword,
  authLogout
} = require('./controllers/authController');
const {
  accountPage,
  accountRegister,
  accountLogin,
  accountResetPassword,
  accountChangePassword,
} = require('./controllers/accountController');

// General
router.get('/', pageIndex);

// Account
router.get('/login', accountLogin);
router.get('/register', accountRegister);
router.get('/account', accountPage);
router.get('/account/reset-password', accountResetPassword);
router.get('/account/change-password', accountChangePassword);

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