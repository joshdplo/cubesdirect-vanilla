import Joi from "joi";

export default Joi.object({
  status: Joi.string().valid('active', 'ordering', 'completed').default('active'),
  userId: Joi.number().integer().required()
});