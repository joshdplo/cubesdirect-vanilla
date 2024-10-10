const express = require('express');
const router = express.Router();
const {
  getIndex,
  getLogin,
  getRegister,
  getCategory
} = require('../controllers/pageController');

// General
router.get('/', getIndex);

// Auth
router.get('/login', getLogin);
router.get('/register', getRegister);

// Products
router.get('/category/:name', getCategory);

module.exports = router;