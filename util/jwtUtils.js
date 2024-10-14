require('dotenv').config();
const jwt = require('jsonwebtoken');

// Issue Token
const issueToken = (user, type = 'access') => {
  const payload = {
    id: user.id,
    roles: user.roles,
    isVerified: user.isVerified
  };

  const secret = type === 'access' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;
  const expiresIn = type === 'access' ? process.env.JWT_ACCESS_EXPIRATION : process.env.JWT_REFRESH_EXPIRATION;

  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
exports.issueToken = issueToken;

// Login User
exports.loginUser = (res, user) => {
  // Create access + refresh tokens
  const accessToken = issueToken(user, 'access');
  const refreshToken = issueToken(user, 'refresh');

  // Set token in cookies
  res.cookie('accessToken', accessToken, { httpOnly: true });
  res.cookie('refreshToken', refreshToken, { httpOnly: true });

  return { accessToken, refreshToken };
};

// Logout User (clear tokens)
exports.logoutUser = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};