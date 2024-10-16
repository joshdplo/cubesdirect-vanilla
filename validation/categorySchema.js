const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  featured: Joi.boolean().default(false)
});