const stringUtils = require('../util/string-utils');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Category Page
// @TODO XSS check for req.name
exports.productCategory = async (req, res, next) => {
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