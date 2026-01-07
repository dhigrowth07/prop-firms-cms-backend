const Joi = require("joi");

const countryBase = {
  name: Joi.string().max(255).required(),
  code: Joi.string().length(2).uppercase().required(),
  flag_url: Joi.string().uri().allow(null, ""),
};

const createCountrySchema = Joi.object(countryBase);

const updateCountrySchema = Joi.object({
  ...countryBase,
}).fork(Object.keys(countryBase), (schema) => schema.optional());

const countryIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

module.exports = {
  createCountrySchema,
  updateCountrySchema,
  countryIdParamSchema,
};

