require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./config/db');
const app = express();

const globals = require('./globals');
const stringUtils = require('./util/string-utils');
const categoryJSON = require('./data/categories.json');

// Connect to DB
connectDB();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.static('./public'));

// Locals
app.locals.stringUtils = stringUtils;
app.locals.categoryData = categoryJSON;
app.locals.global = globals;
app.locals.title = null;

// Views
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/page'));
app.use('/api/auth', require('./routes/auth'));

// Guard Routes
//@TODO update guard routes with better understanding
app.use((req, res, next) => {
  const error = {
    status: 404,
    message: "Page Not Found"
  };

  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log("ERROR", error);
  res.render('pages/error', { error });
});

// Server Start
const PORT = process.env.PORT || 5000;
const NAME = process.env.NAME || 'New Server';
app.listen(PORT, () => console.log(`${NAME} Server running on port ${PORT}`));