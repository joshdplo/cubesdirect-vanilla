const Joi = require('joi');

module.exports = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/).required(),
  isVerified: Joi.boolean().default(false),
  isLocked: Joi.boolean().default(false),
  roles: Joi.array().items(
    Joi.string().valid('user', 'reviewer', 'admin')
  ).default(['user']),
  addresses: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      receiverName: Joi.string().required(),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zip: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().required()
    })
  ).optional(),
  resetPasswordToken: Joi.string().optional(),
  resetPasswordExpires: Joi.date().iso().optional(),
  failedLoginAttempts: Joi.number().integer().default(0)
});