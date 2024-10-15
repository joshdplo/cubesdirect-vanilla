const stringUtils = require('../util/stringUtils');
const { getCache: getCategoryCache } = require('../services/categoryCache');
const { getCache: getProductCache } = require('../services/productCache');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

// Category Page (GET)
//@TODO XSS check for req.params.name
exports.productCategory = async (req, res, next) => {
  const { id } = req.params;

  // pagination query strings
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 2;//@TODO: testing limit, reset to 25
  const offset = (page - 1) * limit;

  try {
    // get standalone category data (include Product model query doesn't support pagination due to many-to-many relationship)
    const category = await getCategoryCache({
      queryType: 'findByPk',
      primaryKey: id,
    });

    const { count: totalProducts, rows: products } = await getProductCache({
      queryType: 'findAndCountAll',
      include: [{
        model: Category,
        where: { id },
        through: { attributes: [] }
      }],
      limit,
      offset
    });

    const totalPages = Math.ceil(totalProducts / limit);

    if (!category || !products) {
      console.error('error finding category or products');
      res.status(404);
      next();
    }

    res.render('pages/product/category', {
      title: `${stringUtils.titleCase(category.name)} Cubes`,
      category,
      products,
      currentPage: page,
      totalPages,
      limit
    });
  } catch (error) {
    console.error(error);
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Product Page (GET)
//@TODO XSS check for req.params.id
exports.productDisplay = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await getProductCache({
      queryType: 'findByPk',
      primaryKey: id,
    });

    if (!product) {
      console.error('product does not exist');
      res.status(404);
      next();
    }

    res.render('pages/product/product', {
      //@TODO: shorten name to x characters
      title: stringUtils.titleCase(product.name),
      product
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Add to Cart (POST)
exports.addToCart = async (req, res, next) => {
  try {
    const isUser = req.user && req.user.id;
    const { productId, productQuantity } = req.body;

    const product = await Product.findByPk(productId);
    // Make sure the product exists + has stock
    //@TODO: refresh product stock on FE after add
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < 1) return res.status(404).json({ message: 'Product out of stock' });

    if (isUser) {
      const userId = req.user.id;

      // Find active Cart or create one if no active cart exists
      let cart = await Cart.findOne({ where: { userId, status: 'active' } });
      if (!cart) cart = await Cart.create({ userId }); //carts have status defaultValue: 'active'

      // Check if product is already in cart - if it is, increase quantity
      let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
      if (cartItem) {
        cartItem.quantity += 1;
        await cartItem.save();
      } else {
        await CartItem.create({
          cartId: cart.id,
          productId: product.id,
          quantity: productQuantity || 1,
          price: product.price
        });
      }

      return res.status(200).json({ message: 'Product added to cart!' });
    } else {
      //@TODO: implement non-user (anonymous) add to cart
      console.error('No user for addToCart');
      return res.status(500).json({ message: 'Anonymous add to cart not implemented' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding to cart' });
  }
};