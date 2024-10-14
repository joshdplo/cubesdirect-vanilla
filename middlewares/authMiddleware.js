require('dotenv').config();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, EMAIL_ENABLED } = process.env;

// Get User object and store in res.locals.user
exports.getUser = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      console.log('HAS TOKEN');//REMOVE
      const decoded = jwt.verify(token, JWT_SECRET);
      res.locals.user = decoded;
    } catch (error) {
      console.error(error);
      res.status(500);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

  next();
};

// Check if authenticated for routes
// - also checks email verification
exports.checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isVerified && EMAIL_ENABLED === 'true') return res.redirect('/verify-email');
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.redirect('/login');
  }
}