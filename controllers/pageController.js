const stringUtils = require('../util/stringUtils');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Index Page (GET)
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
