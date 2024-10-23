import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import validateModel from '../validation/validateModel.js';
import { reviewSchema } from '../validation/reviewSchema.js';
import User from './User.js';
import Product from './Product.js';

//@TODO: joi validation
const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
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

export default Review;