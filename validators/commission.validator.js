const Joi = require("joi");

const commissionBase = {
  account_type_id: Joi.string().uuid().allow(null),
  futures_program_id: Joi.string().uuid().allow(null),
  asset_name: Joi.string().max(255).required(),
  commission_type: Joi.string().valid("per_lot", "percentage", "fixed", "none").required(),
  commission_value: Joi.number().min(0).allow(null),
  commission_text: Joi.string().allow(null, ""),
  notes: Joi.string().allow(null, ""),
};

const createCommissionSchema = Joi.object(commissionBase)
  .custom((value, helpers) => {
    if (!value.account_type_id && !value.futures_program_id) {
      return helpers.error("any.custom", { message: "Either account_type_id or futures_program_id must be provided" });
    }
    if (value.account_type_id && value.futures_program_id) {
      return helpers.error("any.custom", { message: "Cannot provide both account_type_id and futures_program_id" });
    }
    return value;
  })
  .messages({
    "any.custom": "{{#label}} {{#error.message}}",
  });

const updateCommissionSchema = Joi.object({
  ...commissionBase,
}).fork(Object.keys(commissionBase), (schema) => schema.optional());

const commissionIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

module.exports = {
  createCommissionSchema,
  updateCommissionSchema,
  commissionIdParamSchema,
};

