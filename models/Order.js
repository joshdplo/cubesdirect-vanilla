const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const orderSchema = require('../validation/orderSchema');
const validateModel = require('../validation/validateModel');
const User = require('./User');

const Order = sequelize.define('Order', {
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.STRING, // 'pending', 'completed', 'failed'
    defaultValue: 'pending'
  },
  orderStatus: {
    type: DataTypes.STRING, // 'processing', 'shipped', 'delivered', 'cancelled'
    defaultValue: 'processing'
  },
  deliveryAddress: {
    type: DataTypes.JSON, // same as User address!
    allowNull: false,
  }
}, { timestamps: true });

// Relationships
Order.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

module.exports = Order;