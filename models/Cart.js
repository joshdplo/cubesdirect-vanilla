const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const cartSchema = require('../validation/cartSchema');
const validateModel = require('../validation/validateModel');
const User = require('./User');

const Cart = sequelize.define('Cart', {
  status: {
    type: DataTypes.STRING, // 'active', 'ordering', 'completed'
    defaultValue: 'active'
  },
}, { timestamps: true });

// Relationships
Cart.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

module.exports = Cart;