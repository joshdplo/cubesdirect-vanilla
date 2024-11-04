import User from "../models/User.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import { validateAddress } from "../validation/userSchema.js";
import { addMessage } from '../middlewares/globalMessageMiddleware.js';

/**
 * Page Controllers
 */
// Register Page (GET)
export const accountRegister = async (req, res, next) => {
  try {
    // if user is already logged in, redirect to account page
    if (req.user) return res.redirect('/account');

    res.render('pages/account/register', {
      title: 'Register'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Login Page (GET)
export const accountLogin = async (req, res, next) => {
  try {
    // if user is already logged in, redirect to account page
    if (req.user) return res.redirect('/account');

    res.render('pages/account/login', {
      title: 'Log in'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Change Password Page (GET)
export const accountChangePassword = async (req, res, next) => {
  try {
    res.render('pages/account/change-password', {
      title: 'Update Password',
      bundle: 'account'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Account Page (GET)
export const accountPage = async (req, res, next) => {
  try {
    res.render('pages/account/account', {
      title: 'Account',
      bundle: 'account'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Account Addresses (GET)
export const accountAddresses = async (req, res, next) => {
  try {
    res.render('pages/account/addresses', {
      title: 'Addresses',
      bundle: 'account'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Account Orders (GET)
export const accountOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id } });

    res.render('pages/account/orders', {
      title: 'Orders',
      bundle: 'account',
      orders: orders || []
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Account Order (GET)
export const accountOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ where: { id, userId: req.user.id } });

    if (!order) {
      console.error('no order found in accountOrder');
      res.status(404);
      next();
    }

    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product }]
    });

    res.render('pages/account/order', {
      title: 'Order',
      bundle: 'account',
      isGuest: false,
      order,
      orderItems
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

/**
 * Helpers
 */
// handle 'default' address value: if there are existing addresses and the
// new address is set as default, make all other addresses' 'default' values false
const removeAddressesDefaults = (addresses) => {
  return addresses.map((address) => {
    address.default = false;
    return address;
  });
};

/**
 * API Controllers
 */
// Add Address (POST)
export const accountAddAddress = async (req, res, next) => {
  try {
    // validate form data
    const { value: newAddress, errors } = await validateAddress(req.body);
    if (errors) {
      console.error('Validation error in accountAddAddress:', errors);
      return res.status(400).json({ error: 'Error validating form data for new address' });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(404).json({ error: 'User not found' });

    let addresses = req.user.addresses || [];
    if (addresses.length >= 4) return res.status(400).json({ error: 'Only 4 addresses are currently allowed.' });

    // handle 'default' address value: if there are existing addresses and the
    // new address is set as default, make all other addresses' 'default' values false
    if (addresses.length > 0 && newAddress.default === true) addresses = removeAddressesDefaults(addresses);
    if (addresses.length === 0) newAddress.default = true;

    addresses.push(newAddress);

    await User.update({ addresses }, { where: { id: userId } });
    addMessage(req, 'New address added successfully', 'success');
    res.json({ success: true, redirect: '/account/addresses', message: 'Address added successfully' });
  } catch (error) {
    console.error('Error adding address:', error);
    return res.json({ error });
  }
};

// Update Address (POST)
export const accountUpdateAddress = async (req, res, next) => {
  try {
    const { index, ...updatedAddress } = req.body;
    const { value: address, errors } = await validateAddress(updatedAddress);
    if (errors) return res.status(400).json({ error: 'Error validating form data for updating address' });

    const userId = req.user?.id;
    if (!userId) return res.status(404).json({ error: 'User not found' });

    let addresses = req.user.addresses || [];
    const parsedIndex = parseInt(index, 10);
    if (parsedIndex === undefined || parsedIndex < 0 || parsedIndex >= addresses.length) return res.status(400).json({ error: 'Invalid address index' });

    if (address.default === true) addresses = removeAddressesDefaults(addresses);
    addresses[parsedIndex] = { ...addresses[parsedIndex], ...address };

    await User.update({ addresses }, { where: { id: userId } });
    addMessage(req, 'Address updated successfully', 'success');
    res.json({ success: true, redirect: '/account/addresses', message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
    return res.json({ error });
  }
};

// Remove Address (POST)
export const accountRemoveAddress = async (req, res, next) => {
  try {
    const { index } = req.body;

    const userId = req.user?.id;
    if (!userId) return res.status(404).json({ error: 'User not found' });

    const addresses = req.user.addresses || [];
    const parsedIndex = parseInt(index, 10);
    if (parsedIndex === undefined || parsedIndex < 0 || parsedIndex >= addresses.length) return res.status(400).json({ error: 'Invalid address index' });

    addresses.splice(parsedIndex, 1); // remove address

    // ensure one address remains default
    if (addresses.length > 0 && !addresses.some(addr => addr.default)) {
      addresses[0].default = true;
    }

    await User.update({ addresses }, { where: { id: userId } });
    addMessage(req, 'Address removed successfully', 'success');
    res.json({ success: true, redirect: '/account/addresses', message: 'Address removed successfully' });
  } catch (error) {
    console.error('Error removing address:', error);
    return res.json({ error });
  }
};
