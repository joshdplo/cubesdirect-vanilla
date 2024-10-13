const stringUtils = require('../util/string-utils');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

// Category Page (GET)
//@TODO XSS check for req.params.name
exports.productCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findByPk(categoryId, {
      include: {
        model: Product,
        through: { attributes: [] } // excludes the join table data from result
      }
    });
    const products = category.Products;

    if (!category) {
      res.status(404);
      next();
    }

    res.render('pages/category', {
      title: `${stringUtils.titleCase(category.name)} Cubes`,
      category,
      products
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Product Page (GET)
//@TODO XSS check for req.params.id
exports.productDisplay = async (req, res, next) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });

    if (!product) {
      res.status(400);
      next();
    }

    res.render('pages/product', {
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
        console.log({
          cartId: cart.id,
          productId: product.id,
          quantity: productQuantity || 1,
          price: product.price
        });
        //@TODO: LEFT OFF HERE WITH ERROR
        // NOT NULL constraint failed: CartItems.CartId
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