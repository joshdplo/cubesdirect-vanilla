const express = require('express');
const router = express.Router();
const { checkAuth } = require('./middlewares/authMiddleware');
const { pageIndex } = require('./controllers/pageController');
const {
  productCategory,
  productDisplay,
  addToCart
} = require('./controllers/productController');
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
router.get('/account', checkAuth, accountPage);
router.get('/account/reset-password', checkAuth, accountResetPassword);
router.get('/account/change-password', checkAuth, accountChangePassword);

// Products
router.get('/category/:id', productCategory);
router.get('/product/:id', productDisplay);
router.post('/api/cart/add', addToCart);

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