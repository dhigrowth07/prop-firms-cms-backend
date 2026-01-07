const Joi = require("joi");

const base = {
  name: Joi.string().max(255).required(),
  slug: Joi.string().max(255).required(),
  logo_url: Joi.string().uri().allow("", null),
  broker_type: Joi.string().valid("broker", "data_feed", "both").required(),
  website_url: Joi.string().uri().allow("", null),
  is_active: Joi.boolean().default(true),
};

const createBrokerSchema = Joi.object(base);
const updateBrokerSchema = Joi.object(base).fork(Object.keys(base), (s) => s.optional());

module.exports = {
  createBrokerSchema,
  updateBrokerSchema,
};


