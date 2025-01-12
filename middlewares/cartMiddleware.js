import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import { mergeGuestCartWithUserCart } from '../controllers/productController.js';

// Make cart token available on requests
export function cartTokenMiddleware(req, res, next) {
  try {
    let cartToken = req.cookies.cartToken;

    if (!cartToken && !res.locals.user) {
      cartToken = uuidv4();
      res.cookie('cartToken', cartToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 4, // 4 week expiration
        sameSite: 'Strict'
      });
    }

    req.cartToken = cartToken;
    next();
  } catch (error) {
    console.error('Error in cartTokenMiddleware:', error);
    throw new Error(error);
  }
}

// Helper to get CartItem count via quantity field
export async function getCartItemCount(cartId) {
  const result = await CartItem.findOne({
    where: { cartId },
    attributes: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']],
    raw: true
  });

  return result.totalQuantity || 0;
}

// Make cart count available on requests (guest and user)
export async function cartInfoMiddleware(req, res, next) {
  try {
    const { cartToken } = req;
    const { user } = res.locals;

    // set up cart data to modify and pass through via req.cart and res.locals.cart
    const cartData = { count: 0, id: null, type: 'guest' };

    if (user && cartToken) {
      // if both user AND cart token exist, merge the carts
      console.log('Both user and cartToken exist in cartInfoMiddleware - merging.');
      await mergeGuestCartWithUserCart(user.id, cartToken);
      res.clearCookie('cartToken');
    }

    if (user) {
      cartData.type = 'user';

      // get cart id from user
      const cart = await Cart.findOne({
        where: {
          userId: user.id,
          status: 'active'
        }
      });
      if (!cart) {
        req.cart = res.locals.cart = cartData;
        console.log('---cartInfoMiddleware---');
        console.log(req.cart);
        return next();
      }

      // get cart items count from cart id
      const cartCount = await getCartItemCount(cart.id);
      cartData.count = cartCount;
      cartData.id = cart.id;
    } else if (cartToken) {
      // get cart id from token
      const cart = await Cart.findOne({
        where: {
          token: cartToken,
          status: 'active'
        }
      });
      if (!cart) {
        req.cart = res.locals.cart = cartData;
        console.log('---cartInfoMiddleware---');
        console.log(req.cart);
        return next();
      }

      // get cart items count from cart id
      const cartCount = await getCartItemCount(cart.id);
      cartData.count = cartCount;
      cartData.id = cart.id;
    }

    req.cart = res.locals.cart = cartData;
    console.log('---cartInfoMiddleware---');
    console.log(req.cart);
    next();
  } catch (error) {
    console.error('Error in cartInfoMiddleware:', error);
    throw new Error(error);
  }
}