const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const orderItemSchema = require('../validation/orderItemSchema');
const validateModel = require('../validation/validateModel');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, { timestamps: true });

// Relationships
OrderItem.belongsTo(Order, {
  foreignKey: {
    name: 'orderId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

module.exports = OrderItem;