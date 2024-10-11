require('dotenv').config();
const express = require('express');
// const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const app = express();


// Connect to DB
require('./config/db');

// Middlewares
// app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('./public'));

// Locals
app.locals.stringUtils = require('./util/string-utils');
app.locals.categoryData = require('./data/categories.json');
app.locals.global = require('./globals');
app.locals.title = null;
app.locals.isAuthenticated = false; // needed for error page (overridden by checkAuth middleware)
app.use(require('./middlewares/checkAuth'));

// Views
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes'));

// 404s
app.use((req, res, next) => {
  const error = {
    status: 404,
    message: "Page Not Found"
  };

  next(error);
});

// Error Handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);

  if (error.status === 404) {
    res.status(404).render('pages/404', { error });
  } else {
    res.status(error.status || 500).render('pages/error', { error })
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
const NAME = process.env.NAME;
app.listen(PORT, () => console.log(`${NAME} Server running on port ${PORT}`));