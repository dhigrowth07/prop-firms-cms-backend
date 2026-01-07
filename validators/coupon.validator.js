const Joi = require("joi");

const couponBase = {
  code: Joi.string().max(100).required(),
  discount_text: Joi.string().max(255).required(),
  discount_value: Joi.number().min(0).allow(null),
  discount_type: Joi.string().valid("percentage", "fixed").required(),
  description: Joi.string().allow("", null),
  start_date: Joi.date().allow(null),
  end_date: Joi.date().allow(null),
  is_active: Joi.boolean().default(true),
};

const createCouponSchema = Joi.object(couponBase);
const updateCouponSchema = Joi.object(couponBase).fork(
  Object.keys(couponBase),
  (s) => s.optional()
);

// Relation payloads for assigning to firms / account types
const assignCouponToFirmSchema = Joi.object({
  firm_id: Joi.string().uuid().required(),
  coupon_id: Joi.string().uuid().required(),
});

const assignCouponToAccountTypeSchema = Joi.object({
  account_type_id: Joi.string().uuid().required(),
  coupon_id: Joi.string().uuid().required(),
});

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  assignCouponToFirmSchema,
  assignCouponToAccountTypeSchema,
};


