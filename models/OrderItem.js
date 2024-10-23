import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import validateModel from '../validation/validateModel.js';
import { orderItemSchema } from '../validation/orderItemSchema.js';
import Order from './Order.js';
import Product from './Product.js';

//@TODO: joi validation
const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, { timestamps: true });

// Relationships
OrderItem.belongsTo(Order, {
  foreignKey: {
    name: 'orderId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

export default OrderItem;