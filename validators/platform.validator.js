const Joi = require("joi");

const base = {
  name: Joi.string().max(255).required(),
  slug: Joi.string().max(255).required(),
  category: Joi.string().valid("prop", "futures", "both").required(),
  logo_url: Joi.string().uri().allow("", null),
  website_url: Joi.string().uri().allow("", null),
  is_active: Joi.boolean().default(true),
};

const createTradingPlatformSchema = Joi.object(base);
const updateTradingPlatformSchema = Joi.object(base).fork(
  Object.keys(base),
  (schema) => schema.optional()
);

module.exports = {
  createTradingPlatformSchema,
  updateTradingPlatformSchema,
};


