require('dotenv').config();
const sequelize = require('./config/db');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const initAppData = require('./middlewares/initAppMiddleware');
const app = express();

// Connect to DB + Set up sessions
const store = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));
store.sync();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('./public'));

// Middleware dubugging
if (process.env.DEBUG === 'true') {
  app.use((req, res, next) => {
    console.log(`Path: ${req.path}, Method: ${req.method}`);
    console.log(`Request path: ${req.path}`);
    next();
  });
}

// Locals
(async () => { await initAppData(app) })();

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