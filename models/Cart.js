const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Cart = sequelize.define('Cart', {
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active' // 'active', 'ordering', 'completed'
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