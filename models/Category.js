import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import validateModel from '../validation/validateModel.js';
import categorySchema from '../validation/categorySchema.js';
import Product from './Product.js';

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

export default Category;