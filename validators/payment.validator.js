const Joi = require("joi");

const paymentMethodBase = {
  name: Joi.string().max(255).required(),
  slug: Joi.string().max(255).required(),
  logo_url: Joi.string().uri().allow("", null),
  is_active: Joi.boolean().default(true),
};

const createPaymentMethodSchema = Joi.object(paymentMethodBase);
const updatePaymentMethodSchema = Joi.object(paymentMethodBase).fork(
  Object.keys(paymentMethodBase),
  (s) => s.optional()
);

module.exports = {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
};


