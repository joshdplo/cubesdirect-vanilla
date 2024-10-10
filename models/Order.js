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
    defaultValue: 'Pending' // 'Pending', 'Completed', 'Failed'
  },
  orderStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Processing' // 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  },
  deliveryAddress: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidStructure(value) {
        value.forEach((address) => {
          if (!address.street || !address.city || !address.state || !address.zip || !address.country) {
            throw new Error('Invalid address format. Expected { street, city, state, zip, country }')
          }
        })
      }
    }
  }
}, { timestamps: true });

Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;