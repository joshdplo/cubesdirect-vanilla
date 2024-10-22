import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import validateModel from '../validation/validateModel.js';
import cartSchema from '../validation/cartSchema.js';
import User from './User.js';

//@TODO: joi validation
const Cart = sequelize.define('Cart', {
  status: {
    type: DataTypes.STRING, // 'active', 'ordering', 'completed'
    defaultValue: 'active'
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, { timestamps: true });

// Relationships
Cart.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: true
  },
  onDelete: 'CASCADE'
});

export default Cart;