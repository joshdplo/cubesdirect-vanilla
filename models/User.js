const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  roles: {
    type: [String], //['user', 'reviewer', 'admin']
    default: ['user']
  },
  addresses: [
    {
      name: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String
    }
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  resetPasswordToken: {
    type: String,
    default: ''
  },
  resetPasswordExpires: {
    type: Date,
    default: Date.now
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);