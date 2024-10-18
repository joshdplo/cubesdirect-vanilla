import Joi from "joi";

export const passwordValidationMessage = 'Password must be 8-30 characters long and include at least one uppercase letter, one lowercase letter, and one number.';
export const userSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.email': 'Please enter a valid email address.'
  }),
  password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/).required().messages({
    'string.pattern.base': passwordValidationMessage
  }),
  // passwordConfirm only needed on front-end, so set as optional
  passwordConfirm: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/).optional().messages({
    'string.pattern.base': passwordValidationMessage
  }),
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