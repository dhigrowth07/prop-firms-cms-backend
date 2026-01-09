const Joi = require("joi");

const firmBase = {
  name: Joi.string().max(255).required(),
  slug: Joi.string().max(255).required(),
  firm_type: Joi.string().valid("prop_firm", "futures_firm").required(),
  logo_url: Joi.string().uri().allow(null, ""),
  founded_year: Joi.number().integer().min(1900).max(2100).allow(null),
  rating: Joi.number().min(0).max(5).allow(null),
  review_count: Joi.number().integer().min(0).allow(null),
  max_allocation: Joi.number().integer().min(0).allow(null),
  description: Joi.string().allow("", null),
  location: Joi.string().max(255).allow(null, ""),
  guide_video_url: Joi.string().uri().allow(null, ""),
  is_active: Joi.boolean().default(true),
};

const createFirmSchema = Joi.object(firmBase);

const updateFirmSchema = Joi.object({
  ...firmBase,
  // Association arrays for many-to-many relationships
  trading_platform_ids: Joi.array().items(Joi.string().uuid()).optional(),
  broker_ids: Joi.array().items(Joi.string().uuid()).optional(),
  payout_method_ids: Joi.array().items(Joi.string().uuid()).optional(),
  payment_method_ids: Joi.array().items(Joi.string().uuid()).optional(),
  asset_ids: Joi.array().items(Joi.string().uuid()).optional(),
  restricted_country_ids: Joi.array().items(Joi.string().uuid()).optional(),
}).fork(Object.keys(firmBase), (schema) => schema.optional());

const firmIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const firmSlugParamSchema = Joi.object({
  slug: Joi.string().required(),
});

const bulkActionSchema = Joi.object({
  ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
  action: Joi.string().valid("activate", "deactivate", "delete").required(),
});

module.exports = {
  createFirmSchema,
  updateFirmSchema,
  firmIdParamSchema,
  firmSlugParamSchema,
  bulkActionSchema,
};
