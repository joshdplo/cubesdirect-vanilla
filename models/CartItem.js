const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cart = require('./Cart');
const Product = require('./Product');

const CartItem = sequelize.define('CartItem', {
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
CartItem.belongsTo(Cart, {
  foreignKey: {
    name: 'cartId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

CartItem.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

module.exports = CartItem;