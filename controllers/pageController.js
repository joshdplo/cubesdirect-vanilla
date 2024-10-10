const stringUtils = require('../util/string-utils');
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET Index Page
exports.getIndex = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true });

    res.render('pages/index', {
      featuredProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error on index controller');
  }
};

// GET Register Page
// @TODO move to auth flow
exports.getRegister = async (req, res) => {
  try {
    // get user info here
    res.render('pages/register', {
      title: 'Register'
    })
  } catch (err) {
    console.error(err);
    res.status(500).send('Error on login controller');
  }
}

// GET Login Page
// @TODO move to auth flow
exports.getLogin = async (req, res) => {
  try {
    // get user info here
    res.render('pages/login', {
      title: 'Log in'
    })
  } catch (err) {
    console.error(err);
    res.status(500).send('Error on login controller');
  }
}

// GET Category Page
// @TODO XSS check for req.name
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });

    res.render('pages/category', {
      title: `${stringUtils.titleCase(category.name)} Cubes`,
      category
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error on category controller');
  }
};