import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import {
  loginUser,
  logoutUser
} from '../util/jwtUtils.js';

// Authenticate user
const authenticateUser = (requireAuth = false) => {
  return async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
      // 1. If access token exists, verify it
      if (accessToken) {
        try {
          const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
          res.locals.user = {
            id: decoded.id,
            roles: decoded.roles,
            isVerified: decoded.isVerified
          };

          // Check for session data for sensitive user information
          if (!req.session.user) {
            const user = await User.findByPk(decoded.id, { attributes: ['email', 'addresses'] });
            if (!user) return res.status(401).json({ error: 'User not found' });

            req.session.user = { email: user.email, addresses: user.addresses };
          }

          // Attach sensitive user data to locals
          res.locals.user.email = req.session.user.email;
          res.locals.user.addresses = req.session.user.addresses;

          return next();
        } catch (accessError) {
          if (accessError.name === 'TokenExpiredError') {
            console.log('Access token expired, attempting to refresh...');// moves to step 2 in login (refresh)
          } else {
            console.error(accessError);
            throw accessError;
          }
        }
      }

      // 2. If no access token or it is expired, try using refresh token
      if (refreshToken) {
        try {
          const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

          // Issue new access token
          const user = {
            id: decodedRefreshToken.id,
            isVerified: decodedRefreshToken.isVerified,
            roles: decodedRefreshToken.roles
          };
          const { accessToken: newAccesToken } = loginUser(res, user);

          res.locals.user = {
            id: decodedRefreshToken.id,
            roles: decodedRefreshToken.roles,
            isVerified: decodedRefreshToken.isVerified
          };

          // Fetch sensitive user data if not in session
          if (!req.session.user) {
            const user = await User.findByPk(decodedRefreshToken.id, { attributes: ['email', 'addresses'] });
            if (!user) {
              return res.status(401).json({ error: 'User not found' });
            }
            req.session.user = { email: user.email, addresses: user.addresses };
          }

          // Attach sensitive user data to locals
          res.locals.user.email = req.session.user.email;
          res.locals.user.addresses = req.session.user.addresses;

          return next();
        } catch (refreshError) {
          if (refreshError.name === 'TokenExpiredError') {
            console.log('ACCESS + REFRESH TOKENS EXPIRED - AUTOMATIC LOGOUT');
          } else {
            console.error('Refresh error: ', refreshError);
          }

          logoutUser(res);
          if (requireAuth) return res.redirect('/login');
          //@TODO: figure out how to handle this more gracefully ie. if user is in middle of browsing, they will get auto-kicked to the login page @_@
        }
      }

      // 3. No valid tokens
      if (requireAuth) {
        return res.redirect('/login');
      } else {
        res.locals.user = null;
        return next();
      }

    } catch (error) {
      console.error('Authentication error:', error);
      res.locals.user = null;
      if (requireAuth) return res.redirect('/login');
      next();
    }
  }
};

export default authenticateUser;