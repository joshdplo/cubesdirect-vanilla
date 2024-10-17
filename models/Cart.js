import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import validateModel from '../validation/validateModel.js';
import cartSchema from '../validation/cartSchema.js';
import User from './User.js';

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

export default Cart;