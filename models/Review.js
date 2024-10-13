const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');

const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, { timestamps: true });

// Relationships
Review.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Review.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

module.exports = Review;