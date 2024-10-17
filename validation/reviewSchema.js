import Joi from "joi";

export default Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional(),
  userId: Joi.number().integer().required(),
  productId: Joi.number().integer().required()
});