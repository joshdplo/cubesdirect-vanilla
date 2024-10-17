import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import validateModel from '../validation/validateModel.js';
import cartItemSchema from '../validation/cartItemSchema.js';
import Cart from './Cart.js';
import Product from './Product.js';

const CartItem = sequelize.define('CartItem', {
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
CartItem.belongsTo(Cart, {
  foreignKey: {
    name: 'cartId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

CartItem.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

export default CartItem;