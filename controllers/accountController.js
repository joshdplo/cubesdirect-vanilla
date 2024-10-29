import User from "../models/User.js";
import { userSchema } from "../validation/userSchema.js";
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
}

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
}

// Change Password Page (GET)
export const accountChangePassword = async (req, res, next) => {
  try {
    res.render('pages/account/change-password', {
      title: 'Update Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Reset Password Request Page (GET)
export const accountResetPasswordRequest = async (req, res, next) => {
  try {
    // if user is already logged in, redirect to the change password page
    if (req.user) return res.redirect('/account/change-password');

    res.render('pages/account/reset-password-request', {
      title: 'Reset Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Account Page (GET)
export const accountPage = async (req, res, next) => {
  try {
    res.render('pages/account/account', {
      title: 'Account'
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
      title: 'Addresses'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Account Orders (GET)
export const accountOrders = async (req, res, next) => {
  res.render('pages/account/orders', {
    title: 'Orders',
    orders: []
  })
}

/**
 * Helpers
 */
// address validation helper
const validateAddress = async (addressData) => {
  try {
    const addressSchema = userSchema.extract('addresses').$_terms.items[0]; // extract address item schema
    const value = await addressSchema.validateAsync(addressData, { abortEarly: false });
    return { value, errors: null };
  } catch (error) {
    const errors = error.details.reduce((acc, err) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});
    return { value: null, errors };
  }
};

// handle 'default' address value: if there are existing addresses and the
// new address is set as default, make all other addresses' 'default' values false
const removeAddressesDefaults = (addresses) => {
  return addresses.map((address) => {
    address.default = false;
    return address;
  });
}

/**
 * API Controllers
 */
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
}

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
}

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
}
