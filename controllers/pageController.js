import productCache from '../services/productCache.js';

// Index Page (GET)
export const pageIndex = async (req, res, next) => {
  try {
    const featuredProducts = await productCache.getCache({
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
