import 'dotenv/config';
import jwt from 'jsonwebtoken';
import stringUtils from '../util/stringUtils.js';
import { addMessage } from '../middlewares/globalMessageMiddleware.js';
import { validateAddress, validateEmail } from '../validation/userSchema.js';
import { issueOrderToken } from '../util/jwtUtils.js';
import { sendEmail } from '../services/emailService.js';
import categoryCache from '../services/categoryCache.js';
import productCache from '../services/productCache.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';

const isEmailEnabled = process.env.EMAIL_ENABLED === 'true';

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
      category,
      products,
      currentPage: page,
      totalPages,
      limit
    });
  } catch (error) {
    console.error(error);
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
    if (!cartId) {
      addMessage(req, 'Erorr confirming cart - you have been redirected to the cart page', 'error');
      return res.redirect('/cart');
    }

    const cartItems = await CartItem.findAll({
      where: { cartId },
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'images'] }]
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    let userAddresses = [];
    if (req.user) userAddresses = req.user.addresses || [];

    const shippingAddress = req.session.shippingAddress || null;

    res.render('pages/product/checkout', {
      title: 'Checkout',
      items: cartItems,
      subtotal,
      addresses: userAddresses,
      shippingAddress,
      isGuest: !req.user
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Checkout Payment Page (GET)
export const productCheckoutPayment = async (req, res, next) => {
  try {
    if (!req.session.shippingAddress) {
      addMessage(req, `Error with shipping address on checkout payment. Please enter${req.user ? ' or select' : ''} a shipping address`, 'error');
      return res.redirect('/checkout');
    }

    const cartId = req.cart?.id;
    if (!cartId) {
      addMessage(req, 'Erorr confirming cart - you have been redirected to the cart page', 'error');
      return res.redirect('/cart');
    }

    const cartItems = await CartItem.findAll({
      where: { cartId },
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'images'] }]
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

    let userAddresses = [];
    if (req.user) userAddresses = req.user.addresses || [];

    res.render('pages/product/checkout-payment', {
      title: 'Checkout - Payment',
      items: cartItems,
      subtotal,
      addresses: userAddresses,
      shippingAddress: req.session.shippingAddress,
      isGuest: !req.user
    });
  } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
  }
}

// Checkout Confirmation Page (GET)
export const productGuestOrder = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      console.error('no token param provided on /guest-order!');
      res.status(404);
      next();
    }

    const decoded = jwt.verify(token, process.env.JWT_ORDER_SECRET);
    const order = await Order.findOne({ where: { id: decoded.orderId, guestEmail: decoded.email } });

    if (!order) {
      console.error('no order found on /guest-order!');
      res.status(404);
      next();
    }

    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product }]
    });

    res.render('pages/account/order', {
      title: 'Guest Order',
      isGuest: true,
      order,
      orderItems
    });
  } catch (error) {
    console.error(error);
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

    // disabling quantity updates on add to cart - this will only happen on checkout complete now
    // product.stock -= quantity;
    // await product.save();
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
    if (product.stock - productQuantity < 0) return res.status(404).json({ error: `There are only ${product.stock} of these products left. Please add fewer products.` });

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

    // return error if not enough stock is avilable
    const product = cartItem.Product;
    if (product.stock - quantity < 0) return res.status(400).json({ error: 'Not enough stock available' });

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

    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) return res.status(404).json({ error: 'Item not found' });

    await cartItem.destroy();
    return res.status(200).json({ success: true, redirect: '/cart', message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error removing from cart' });
  }
};

// Checkout Shipping Submit (POST)
export const productCheckoutShippingSubmit = async (req, res, next) => {
  try {
    const { changeAddress, addressIndex, ...newAddress } = req.body;

    if (changeAddress) {
      delete req.session.shippingAddress;
      return res.status(200).json({ success: true, redirect: '/checkout', message: 'You can now choose a new address for your order' });
    }

    let shippingAddress;
    if (req.user && addressIndex !== undefined) {
      shippingAddress = req.user.addresses[addressIndex];
    } else if (newAddress) {
      const { value: address, errors } = await validateAddress(newAddress);
      if (errors) {
        console.error('Validation error in productCheckoutShippingSubmit:', errors);
        return res.status(400).json({ error: 'Error validating form data for new address' });
      }

      shippingAddress = address;
    } else {
      return res.status(400).json({ error: 'Insufficient data sent in checkout shipping' });
    }

    req.session.shippingAddress = shippingAddress; // store shipping address in session
    return res.status(200).json({ success: true, redirect: '/checkout/payment', message: 'Shipping information confirmed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error with shipping info in checkout' });
  }
};

// Checkout Payment Submit (POST)
export const productCheckoutPaymentSubmit = async (req, res, next) => {
  try {
    const { changeAddress, addressIndex, paymentData, newAddress, guestEmail } = req.body;
    const isGuest = !req.user;

    // ensure we have a shipping address in the session
    if (!req.session.shippingAddress) {
      return res.status(400).json({ error: 'No shipping address available in payment submit' });
    }

    // if user wants to change address, redirect them to checkout shipping step
    if (changeAddress) {
      delete req.session.shippingAddress;
      return res.status(200).json({ success: true, redirect: '/checkout', message: 'You can now choose a new address for your order' });
    }

    // if guest, ensure we have an email address
    if (isGuest) {
      if (!guestEmail) return res.status(400).json({ error: 'No guest email sent on payment step' });

      const { value, errors } = await validateEmail(guestEmail);
      if (errors) {
        console.error('Guest email validation error in productCheckoutShippingSubmit:', errors);
        return res.status(400).json({ guestEmailErrors: errors, error: 'Error validating guest email address' });
      }
    }

    // get user billing address and validate it (via newAddress or addressIndex)
    let billingAddress;
    if (req.user && addressIndex !== undefined && addressIndex !== 'new') {
      billingAddress = req.user.addresses[addressIndex];
    } else if (newAddress) {
      const { value: address, errors } = await validateAddress(newAddress);
      if (errors) {
        console.error('Validation error in productCheckoutShippingSubmit:', errors);
        return res.status(400).json({ newBillingAddressErrors: errors, error: 'Error validating billing address form data for new address' });
      }

      billingAddress = address;
    } else {
      return res.status(400).json({ error: 'Insufficient billing address data sent in checkout payment' });
    }

    // validate cc payment information (mock)
    if (!paymentData.cardNumber || !paymentData.cardExpiry || !paymentData.cardCVC) {
      return res.status(400).json({ ccErrors: true, error: 'Error validating credit card information' });
    }

    // create the order
    const cartId = req.cart?.id;
    if (!cartId) {
      addMessage(req, 'Erorr confirming cart - you have been redirected to the cart page', 'error');
      return res.redirect('/cart');
    }

    const cartItems = await CartItem.findAll({
      where: { cartId },
      include: [{ model: Product, attributes: ['id', 'stock'] }]
    });
    const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const newOrder = await Order.create({
      userId: req.user?.id || null,
      guestEmail,
      shippingAddress: req.session.shippingAddress,
      billingAddress,
      paymentStatus: 'completed',
      orderStatus: 'processing',
      totalAmount
    });

    // create OrderItems from CartItems and update stock of products
    await Promise.all(cartItems.map(async (item) => {
      await OrderItem.create({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });

      const product = item.Product;
      if (product.stock >= item.quantity) {
        const newStock = product.stock - item.quantity;
        console.log('------------');
        console.log(`item quantity: ${item.quantity}`);
        console.log(`original product ${product.id} stock: ${product.stock}`);
        console.log(`new product ${product.id} stock (${product.stock} - ${item.quantity}): ${newStock}`);

        product.sock = newStock;
        await product.save();

        // invalidate individual product cache
        productCache.invalidateCache({
          queryType: 'findByPk',
          primaryKey: product.id,
        });
      } else {
        throw new Error(`Insufficient stock for product ID ${product.id}`);
      }
    }));

    // delete the cart after order creation
    await Cart.destroy({ where: { id: cartId } });

    // clear session
    delete req.session.shippingAddress;

    // set up final redirect and email
    let redirect = `/account/orders/${newOrder.id}`;
    let emailText = `You can view your order in your account at any time, or you can use the below link:\nhttp://${req.headers.host}/account/orders/${newOrder.id}`;
    if (isGuest) {
      const token = issueOrderToken(newOrder.id, guestEmail);
      const orderLink = `http://${req.headers.host}/guest-order/${token}`;
      emailText = `Please use the below link to access your order details:\n${orderLink}`;
      redirect = `/guest-order/${token}`;
    }

    if (isEmailEnabled) {
      await sendEmail({
        to: isGuest ? guestEmail : req.user.email,
        subject: `Your ${NAME} Order`,
        text: `Your ${NAME} order has been confirmed and is being processed.\n${emailText}\n\nTotal: $${newOrder.totalAmount.toFixed(2)}\nNumber of items: ${cartItems.length}\n\nThank you for shopping ${NAME}!`
      });
    }

    addMessage(req, 'Your order has been placed!', 'success');
    return res.status(200).json({ success: true, redirect, message: 'Order submitted! You will be redirected to the confirmation page shortly.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
