const Joi = require("joi");

const ruleBase = {
  firm_id: Joi.string().uuid().required(),
  category: Joi.string().valid("trading", "risk", "consistency", "payout").required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().required(),
};

const payoutPolicyBase = {
  firm_id: Joi.string().uuid().required(),
  payout_frequency: Joi.string().max(255).required(),
  first_payout_days: Joi.number().integer().min(0).required(),
  profit_split_initial: Joi.number().min(0).max(100).required(),
  profit_split_max: Joi.number().min(0).max(100).required(),
  notes: Joi.string().allow("", null),
  program_type: Joi.string().max(255).allow("", null),
};

const createRuleSchema = Joi.object(ruleBase);
const updateRuleSchema = Joi.object(ruleBase).fork(Object.keys(ruleBase), (s) => s.optional());

const createPayoutPolicySchema = Joi.object(payoutPolicyBase);
const updatePayoutPolicySchema = Joi.object(payoutPolicyBase).fork(Object.keys(payoutPolicyBase), (s) => s.optional());

module.exports = {
  createRuleSchema,
  updateRuleSchema,
  createPayoutPolicySchema,
  updatePayoutPolicySchema,
};
