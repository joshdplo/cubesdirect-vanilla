const stringUtils = require('../util/stringUtils');
const { getCache: getProductCache } = require('../services/productCache');

// Index Page (GET)
exports.pageIndex = async (req, res, next) => {
  try {
    const featuredProducts = await getProductCache({
      queryType: 'findAll',
      where: { featured: true }
    });

    res.render('pages/index', {
      featuredProducts
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};
