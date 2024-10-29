import Joi from "joi";

export const orderSchema = Joi.object({
  totalAmount: Joi.number().precision(2).positive().required(),
  paymentStatus: Joi.string().valid('pending', 'completed', 'failed').default('pending'),
  OrderStatus: Joi.string().valid('processing', 'shipped', 'delivered', 'cancelled').default('processing'),
  deliveryAddress: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    default: Joi.boolean().default(false),
  }).required(),
  userId: Joi.number().integer().required()
});