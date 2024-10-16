const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const categorySchema = require('../validation/categorySchema');
const validateModel = require('../validation/validateModel');
const Product = require('./Product');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      async isValid(value) {
        validateModel(categorySchema, { name: value })
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      async isValid(value) {
        validateModel(categorySchema, { description: value }, true)
      }
    }
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      async isValid(value) {
        validateModel(categorySchema, { featured: value })
      }
    }
  },
}, { timestamps: true });

// Relationships
Category.belongsToMany(Product, { through: 'ProductCategory' });
Product.belongsToMany(Category, { through: 'ProductCategory' });

module.exports = Category;