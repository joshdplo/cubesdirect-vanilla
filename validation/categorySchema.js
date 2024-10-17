import Joi from "joi";

export default Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  featured: Joi.boolean().default(false)
});