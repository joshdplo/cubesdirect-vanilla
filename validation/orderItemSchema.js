import Joi from "joi";

export default Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).positive().required(),
  orderId: Joi.number().integer().required(),
  productId: Joi.number().integer().required()
});