const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Cart = sequelize.define('Cart', {
  // no fields currently, using CartItem to link items to user's Cart
}, { timestamps: true });

Cart.belongsTo(User, { foreignKey: 'userId' });

module.exports = Cart;