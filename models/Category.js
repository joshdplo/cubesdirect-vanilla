import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import validateModel from '../validation/validateModel.js';
import { categorySchema } from '../validation/categorySchema.js';
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
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id'
    }
  }
}, { timestamps: true });

// Product Relationships
Category.belongsToMany(Product, {
  through: 'ProductCategory',
  foreignKey: 'categoryId',
  otherKey: 'productId'
});
Product.belongsToMany(Category, {
  through: 'ProductCategory',
  foreignKey: 'productId',
  otherKey: 'categoryId'
});

// Self-referential association for subcategories
Category.hasMany(Category, {
  foreignKey: 'parentId',
  as: 'subcategories'
});
Category.belongsTo(Category, {
  foreignKey: 'parentId',
  as: 'parentCategory'
});

export default Category;