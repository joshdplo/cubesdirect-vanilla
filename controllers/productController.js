import stringUtils from '../util/stringUtils.js';
import categoryCache from '../services/categoryCache.js';
import productCache from '../services/productCache.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';

/**
 * Cart Helpers
 */
// Add item to user cart
const handleUserCartAddItem = async (userId, product, quantity) => {
  try {
    // get cart or create new
    let cart = await Cart.findOne({
      where: {
        userId,
        status: 'active'
      }
    });
    if (!cart) cart = await Cart.create({ where: userId });

    // update existing cartItem or create new
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: product.id
      }
    });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId: product.id,
        quantity: quantity || 1,
        price: product.price
      });
    }
  } catch (error) {
    console.error('Error in handleUserCartAddItem', error);
  }
};

// Add item to guest cart
const handleGuestCartAddItem = async (cartToken, product, quantity) => {
  try {
    // get cart or create new
    let cart = await Cart.findOne({
      where: {
        token: cartToken,
        userId: null
      }
    });
    if (!cart) cart = await Cart.create({ token: cartToken });

    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: product.id
      }
    });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId: product.id,
        quantity: quantity || 1,
        price: product.price
      });
    }
  } catch (error) {
    console.error('Error in handleGuestCartAddItem', error);
  }
}

/**
 * Controllers
 */
// Category Page (GET)
export const productCategory = async (req, res, next) => {
  const { id } = req.params;

  // pagination query strings
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 2;//@TODO: testing limit, reset to 25
  const offset = (page - 1) * limit;

  try {
    // get standalone category data (include Product model query doesn't support pagination due to many-to-many relationship)
    const category = await categoryCache.getCache({
      queryType: 'findByPk',
      primaryKey: id,
    });

    const { count: totalProducts, rows: products } = await productCache.getCache({
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
export const productDisplay = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await productCache.getCache({
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
//@TODO: LEFT OFF HERE
// - need to implement cart middleware
//  - look into universal authMiddleware implementation while we're updating middlewares
// - need to implement cart merges on login (merge the carts wherever we are using `loginUser` from jwtUtils.js)
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.session?.user?.id;
    const { productId, productQuantity, cartToken } = req.body;

    const product = await Product.findByPk(productId);
    // Make sure the product exists + has stock
    //@TODO: refresh product stock on FE after add
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < 1) return res.status(404).json({ message: 'Product out of stock' });

    // Add to cart (either user cart or guest cart if no user)
    if (userId) {
      await handleUserCartAddItem(userId, product, productQuantity);
      return res.status(200).json({ message: 'Product added to user cart!' });
    } else {
      await handleGuestCartAddItem(cartToken, product, productQuantity);
      return res.status(200).json({ message: 'Product added to guest cart!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding to cart' });
  }
};