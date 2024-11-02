import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import validateModel from '../validation/validateModel.js';
import { orderSchema } from '../validation/orderSchema.js';
import User from './User.js';

//@TODO: joi validation
const Order = sequelize.define('Order', {
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.STRING, // 'pending', 'completed', 'failed'
    defaultValue: 'pending'
  },
  orderStatus: {
    type: DataTypes.STRING, // 'processing', 'shipped', 'delivered', 'cancelled'
    defaultValue: 'processing'
  },
  shippingAddress: {
    type: DataTypes.JSON, // same as User address!
    allowNull: false,
  },
  billingAddress: {
    type: DataTypes.JSON, // same as User address!
    allowNull: false,
  },
  guestEmail: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, { timestamps: true });

// Relationships
Order.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: true
  },
  onDelete: 'CASCADE'
});

export default Order;