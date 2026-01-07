const Joi = require("joi");

const payoutMethodBase = {
  name: Joi.string().max(255).required(),
  slug: Joi.string().max(255).required(),
  logo_url: Joi.string().uri().allow("", null),
  is_active: Joi.boolean().default(true),
};

const createPayoutMethodSchema = Joi.object(payoutMethodBase);
const updatePayoutMethodSchema = Joi.object(payoutMethodBase).fork(
  Object.keys(payoutMethodBase),
  (s) => s.optional()
);

module.exports = {
  createPayoutMethodSchema,
  updatePayoutMethodSchema,
};


