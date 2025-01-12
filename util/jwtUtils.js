import 'dotenv/config';
import jwt from 'jsonwebtoken';

// Issue Standard Token
export const issueToken = (user, type = 'access') => {
  const payload = {
    id: user.id,
    roles: user.roles,
    isVerified: user.isVerified
  };

  let secret, expiresIn;
  if (type === 'access') {
    secret = process.env.JWT_ACCESS_SECRET;
    expiresIn = process.env.JWT_ACCESS_EXPIRATION;
  } else if (type === 'refresh') {
    secret = process.env.JWT_REFRESH_SECRET;
    expiresIn = process.env.JWT_REFRESH_EXPIRATION
  } else if (type === 'email') {
    secret = process.env.JWT_EMAIL_SECRET;
    expiresIn = process.env.JWT_EMAIL_EXPIRATION;
  }

  return jwt.sign(payload, secret, { expiresIn });
};

// Issue Order Token
export const issueOrderToken = (orderId, email) => {
  const payload = { orderId, email };
  const secret = process.env.JWT_ORDER_SECRET;
  const expiresIn = process.env.JWT_ORDER_EXPIRATION;

  // return jwt.sign(payload, secret, { expiresIn });
  return jwt.sign(payload, secret); // leaving out expiresIn for no expiration
}

// Login User
export const loginUser = (req, res, user) => {
  // Create access + refresh tokens
  const accessToken = issueToken(user, 'access');
  const refreshToken = issueToken(user, 'refresh');

  // Set token in cookies
  res.cookie('accessToken', accessToken, { httpOnly: true });
  res.cookie('refreshToken', refreshToken, { httpOnly: true });

  if (req.session.shippingAddress) delete req.session.shippingAddress;
  return { accessToken, refreshToken };
};

// Logout User (clear tokens)
export const logoutUser = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  if (req.session.shippingAddress) delete req.session.shippingAddress;
};