import Joi from "joi";

export const cartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).positive().required(),
  cartId: Joi.number().integer().required(),
  productId: Joi.number().integer().required(),

  cartItemId: Joi.number().integer().optional(), // front-end only
});