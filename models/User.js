const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  roles: {
    type: DataTypes.JSON, //['user', 'reviewer', 'admin']
    defaultValue: ['user']
  },
  addresses: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      isValidUserAddresses(value) {
        if (!value) return;
        if (!Array.isArray(value)) {
          throw new Error('Addresses must be an array.');
        }
        value.forEach((address) => {
          //@TODO: ensure these objects values are strings
          if (!address.name || !address.street || !address.city || !address.state || !address.zip || !address.country || !address.phone) {
            throw new Error('Invalid address format. Expected { name, street, city, state, zip, country, phone }')
          }
        })
      }
    }
    // {
    //   name: String,
    //   street: String,
    //   city: String,
    //   state: String,
    //   zip: String,
    //   country: String,
    //   phone: String
    // }
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
    //@TODO: check that this defaultValue is correct - link below
    // https://sequelize.org/docs/v7/models/data-types/#dates
  },
  failedLoginAttempts: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { timestamps: true });

module.exports = User;