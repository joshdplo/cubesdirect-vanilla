import stringUtils from '../util/stringUtils.js';
import categoryCache from '../services/categoryCache.js';
import productCache from '../services/productCache.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';

/**
 * Page Controllers
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
      bundle: 'category',
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
      bundle: 'product',
      product
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Cart Page (GET)
export const productCart = async (req, res, next) => {
  try {
    const cartData = { items: [], subtotal: 0 };
    const cartId = req.cart?.id;
    if (!cartId) console.log('No cart was found in productCart controller');

    const cartItems = await CartItem.findAll({
      where: { cartId },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'images']
      }]
    });

    cartData.items = cartItems;
    cartData.subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    res.render('pages/product/cart', {
      title: 'Cart',
      bundle: 'cart',
      items: cartData.items,
      subtotal: cartData.subtotal
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Checkout Page (GET)
export const productCheckout = async (req, res, next) => {
  try {
    const cartId = req.cart?.id;
    if (!cartId) return res.redirect('/cart'); // if no cart, return to cart page

    const cartItems = await CartItem.findAll({
      where: { cartId },
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'images'] }]
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    let userAddresses = [];
    if (req.user) userAddresses = req.user.addresses || [];

    res.render('pages/product/checkout', {
      title: 'Checkout',
      items: cartItems,
      subtotal,
      addresses: userAddresses,
      isGuest: !req.user
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

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
    if (!cart) {
      console.log('no user cart exists in handleUserCartAdditem - creating one');
      cart = await Cart.create({ userId });
    }

    // update existing cartItem or create new
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: product.id
      }
    });

    if (cartItem) {
      console.log('cartItem already in user cart, updating quantity');
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      console.log('cartItem not in user cart, adding new cartItem');
      await CartItem.create({
        cartId: cart.id,
        productId: product.id,
        quantity: quantity || 1,
        price: product.price
      });
    }

    product.stock -= quantity;
    await product.save();
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
    if (!cart) {
      console.log('no guest cart exists in handleGuestCartAdditem - creating one');
      cart = await Cart.create({ token: cartToken });
    }

    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: product.id
      }
    });

    if (cartItem) {
      console.log('cartItem already in guest cart - updating quantity');
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      console.log('cartItem not in guest cart - adding cartItem');
      await CartItem.create({
        cartId: cart.id,
        productId: product.id,
        quantity: quantity || 1,
        price: product.price
      });
    }

    product.stock -= quantity;
    await product.save();
  } catch (error) {
    console.error('Error in handleGuestCartAddItem', error);
  }
};

// Merge guest cart with user cart
export const mergeGuestCartWithUserCart = async (userId, cartToken) => {
  try {
    // get guest cart - if none, just return
    const guestCart = await Cart.findOne({
      where: {
        token: cartToken,
        userId: null
      }
    });
    if (!guestCart) {
      console.log('no guest cart found in merge, returning.');
      return;
    }

    // get user cart - if none, create one
    let userCart = await Cart.findOne({
      where: {
        userId,
        status: 'active'
      }
    });
    if (!userCart) userCart = await Cart.create({ userId });

    // take all items from guest cart and add them to user cart
    // if item is already in the cart, update the quantity
    const guestCartItems = await CartItem.findAll({ where: { cartId: guestCart.id } });
    for (const item of guestCartItems) {
      let cartItem = await CartItem.findOne({
        where: {
          cartId: userCart.id,
          productId: item.productId
        }
      });
      if (cartItem) {
        cartItem.quantity += item.quantity;
        await cartItem.save();
      } else {
        await CartItem.create({
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }
    }

    // delete the guest cart
    await guestCart.destroy();
    console.log('Successfully merged guest cart with user cart! Guest cart destroyed.');
  } catch (error) {
    console.error('Error merging guest cart with user cart', error);
    throw new Error(error);
  }

};

/**
 * API Controllers
 */
// Add to Cart (POST)
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const cartToken = req.cartToken;
    const { productId, productQuantity } = req.body;

    const product = await Product.findByPk(productId);
    // Make sure the product exists + has stock
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < 1) return res.status(404).json({ error: 'Product out of stock' });
    if (product.stock - productQuantity < 1) return res.status(404).json({ error: `There are only ${product.stock} of these products left. Please add fewer products.` });

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
    return res.status(500).json({ error: 'Error adding to cart' });
  }
};

// Update Cart Item (POST)
export const updateCartItem = async (req, res, next) => {
  try {
    const { cartItemId, quantity } = req.body;

    const cartItem = await CartItem.findByPk(cartItemId, { include: Product });
    if (!cartItem) return res.status(404).json({ error: 'Item not found' });

    // update stock, return error if
    const product = cartItem.Product;
    const quantityDifference = quantity - cartItem.quantity;

    if (quantityDifference > 0) {
      if (product.stock < quantityDifference) return res.status(400).json({ error: 'Not enough stock available' });
      product.stock -= quantityDifference;
    } else {
      product.stock += Math.abs(quantityDifference);
    }
    await product.save();

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json({ success: true, redirect: '/cart', message: 'Item quantity updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error updating cart item quantity' });
  }
};

// Remove Cart Item (POST)
export const removeCartItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.body;

    const cartItem = await CartItem.findByPk(cartItemId, { include: Product });
    if (!cartItem) return res.status(404).json({ error: 'Item not found' });

    cartItem.Product.stock += cartItem.quantity;
    await cartItem.Product.save();

    await cartItem.destroy();
    return res.status(200).json({ success: true, redirect: '/cart', message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error removing from cart' });
  }
};