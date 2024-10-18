export const setMessage = (req, message, type = 'info') => {
  req.session.message = { text: message, type };
};

export const messageMiddleware = (req, res, next) => {
  res.locals.message = req.session.message || null;
  req.session.message = null; // Clear message after transferring to res.locals
  next();
}