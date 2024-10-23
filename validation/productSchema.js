import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().precision(2).positive().required(),
  discountPrice: Joi.number().precision(2).positive().optional(),
  stock: Joi.number().integer().min(0).default(0),
  images: Joi.array().items(
    Joi.string().uri()
  ).default(['/images/product/placeholder.webp']),
  featured: Joi.boolean().default(false)
});