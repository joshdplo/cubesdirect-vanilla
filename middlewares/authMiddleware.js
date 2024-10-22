import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  loginUser,
  logoutUser
} from '../util/jwtUtils.js';

// Helper to attach user data to request and response
const attachUserData = async (req, res, userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'addresses', 'roles', 'isVerified']
  });
  if (user) {
    req.user = res.locals.user = {
      id: user.id,
      email: user.email,
      addresses: user.addresses,
      roles: user.roles,
      isVerified: user.isVerified
    }
  } else {
    req.user = res.locals.user = null;
  }
};

// Route-level auth middleware
export const authenticateUser = (requireAuth = false) => (req, res, next) => {
  if (requireAuth && !req.user) return res.redirect('/login');
  next();
};

// Global middleware - load user data
export const loadUser = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        await attachUserData(req, res, decoded.id);
        return next();
      } catch (accessError) {
        if (accessError.name === 'TokenExpiredError') {
          console.log('Access token expired, attempting refresh...');
        } else {
          console.error('Access token error:', accessError);
          throw accessError;
        }
      }
    }

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const { accessToken: newAccesToken } = loginUser(res, decoded);
        await attachUserData(req, res, decoded.id);
        return next();
      } catch (refreshError) {
        if (refreshError.name === 'TokenExpiredError') {
          console.log('ACCESS + REFRESH TOKENS EXPIRED - AUTOMATIC LOGOUT');
        }
        console.error('Refresh token error:', refreshError);
        logoutUser(res);
        req.user = res.locals.user = null;
        return next();
      }
    }

    // no valid tokens, set user to null
    req.user = res.locals.user = null;
    next();
  } catch (error) {
    console.error('authMiddleware error:', error);
    req.user = res.locals.user = null;
    next();
  }
};
