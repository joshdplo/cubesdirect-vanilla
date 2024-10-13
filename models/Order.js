const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // 'pending', 'completed', 'failed'
  },
  orderStatus: {
    type: DataTypes.STRING,
    defaultValue: 'processing' // 'processing', 'shipped', 'delivered', 'cancelled'
  },
  deliveryAddress: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidOrderDeliveryAddress(value) {
        //@TODO: ensure these objects values are strings
        if (!value.street || !value.city || !value.state || !value.zip || !value.country) {
          throw new Error('Invalid address format. Expected { street, city, state, zip, country }');
        }
      }
    }
  }
}, { timestamps: true });

// Relationships
Order.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

module.exports = Order;