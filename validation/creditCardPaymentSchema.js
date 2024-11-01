import Joi from "joi";

export const creditCardPaymentSchema = Joi.object({
  cardNumber: Joi.string().creditCard().required(),
  cardExpiry: Joi.date().greater('now').required(),
  cardCVC: Joi.number().integer().required()
});