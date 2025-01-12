import Joi from "joi";

export const cartSchema = Joi.object({
  status: Joi.string().valid('active', 'ordering', 'completed').default('active'),
  token: Joi.string().allow(null).optional(),
  userId: Joi.number().integer().allow(null).optional()
});