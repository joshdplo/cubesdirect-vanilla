import Joi from "joi";

/**
 * User Schema
 */
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/;
export const passwordRegexMessages = { 'string.pattern.base': 'Password must be 8-30 characters long and include at least one uppercase letter, one lowercase letter, and one number.' };

const basePassword = Joi.string().pattern(passwordRegex).required().messages(passwordRegexMessages);
const optionalPassword = Joi.string().pattern(passwordRegex).optional().messages(passwordRegexMessages);

const schemaMap = {
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.email': 'Please enter a valid email address.'
  }),
  password: basePassword,
  passwordConfirm: optionalPassword, // front-end only
  newPassword: optionalPassword, // front-end only
  newPasswordConfirm: optionalPassword, // front-end only
  cartToken: Joi.string().allow(null).optional(), // front-end only
  isVerified: Joi.boolean().default(false),
  isLocked: Joi.boolean().default(false),
  roles: Joi.array().items(
    Joi.string().valid('user', 'reviewer', 'admin')
  ).default(['user']),
  addresses: Joi.array().items(
    Joi.object({
      index: Joi.number().integer().allow(null).optional(), // front-end only
      title: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zip: Joi.string().required(),
      default: Joi.boolean().default(false),
    })
  ).optional(),
  resetPasswordToken: Joi.string().allow(null).optional(),
  resetPasswordExpires: Joi.date().allow(null).iso().optional(),
  failedLoginAttempts: Joi.number().integer().default(0)
};

export const userSchema = Joi.object(schemaMap);

/**
 * Validate Address helper
 */
export const validateAddress = async (addressData) => {
  try {
    const addressSchema = userSchema.extract('addresses').$_terms.items[0]; // extract address item schema
    const value = await addressSchema.validateAsync(addressData, { abortEarly: false });
    return { value, errors: null };
  } catch (error) {
    const errors = error.details.reduce((acc, err) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});
    return { value: null, errors };
  }
};