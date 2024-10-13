const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, { timestamps: true });

// Relationships
Category.belongsToMany(Product, { through: 'ProductCategory' });
Product.belongsToMany(Category, { through: 'ProductCategory' });

module.exports = Category;