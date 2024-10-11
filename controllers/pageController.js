const stringUtils = require('../util/string-utils');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Index Page
exports.pageIndex = async (req, res, next) => {
  try {
    const featuredProducts = await Product.findAll({ where: { featured: true } });

    res.render('pages/index', {
      featuredProducts
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Register Page
exports.pageRegister = async (req, res, next) => {
  try {
    res.render('pages/register', {
      title: 'Register'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Login Page
exports.pageLogin = async (req, res, next) => {
  try {
    res.render('pages/login', {
      title: 'Log in'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Reset Password Page
exports.pageResetPassword = async (req, res, next) => {
  try {
    res.render('pages/reset-password', {
      title: 'Reset Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Change Password Page
exports.pageChangePassword = async (req, res, next) => {
  try {
    res.render('pages/change-password', {
      title: 'Update Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Category Page
// @TODO XSS check for req.name
exports.pageCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { name: req.params.name } });

    if (!category) {
      res.status(400);
      next();
    }

    res.render('pages/category', {
      title: `${stringUtils.titleCase(category.name)} Cubes`,
      category
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};