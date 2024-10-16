const Joi = require('joi');

module.exports = Joi.object({
  status: Joi.string().valid('active', 'ordering', 'completed').default('active'),
  userId: Joi.number().integer().required()
});