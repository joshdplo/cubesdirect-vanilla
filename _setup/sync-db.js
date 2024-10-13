const sequelize = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');
const CartItem = require('../models/CartItem');
const OrderItem = require('../models/OrderItem');

async function syncDB() {
  await sequelize.sync({ force: true }); // force table drop + recreate
  console.log('Database synced successfully');
}

syncDB().catch((err) => console.error('Error syncing DB', err));