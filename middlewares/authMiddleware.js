require('dotenv').config();
const jwt = require('jsonwebtoken');

// Get User object and store in res.locals.user
exports.getUser = (req, res, next) => {
  console.log('-----GETUSER MIDDLEWARE-----');//REMOVE
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch (error) {
      res.status(500);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

  next();
};

// Check if authenticated - if not, redirect to login
exports.checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect('/login');
  }
}