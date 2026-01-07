const Joi = require("joi");

const assetBase = {
  name: Joi.string().max(255).required(),
};

const accountTypeBase = {
  firm_id: Joi.string().uuid().required(),
  name: Joi.string().max(255).required(),
  starting_balance: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),
  profit_target: Joi.number().required(),
  daily_drawdown: Joi.number().required(),
  max_drawdown: Joi.number().required(),
  profit_split: Joi.number().min(0).max(100).required(),
  evaluation_required: Joi.boolean().default(true),
  program_variant: Joi.string().max(255).allow(null, ""),
  program_name: Joi.string().max(255).allow(null, ""),
};

const evaluationStageBase = {
  account_type_id: Joi.string().uuid().required(),
  stage_number: Joi.number().integer().min(1).required(),
  profit_target: Joi.number().required(),
  max_daily_loss: Joi.number().required(),
  max_total_loss: Joi.number().required(),
  min_trading_days: Joi.number().integer().min(0).required(),
};

const createAssetSchema = Joi.object(assetBase);
const updateAssetSchema = Joi.object(assetBase).fork(Object.keys(assetBase), (s) => s.optional());

const createAccountTypeSchema = Joi.object(accountTypeBase);
const updateAccountTypeSchema = Joi.object(accountTypeBase).fork(Object.keys(accountTypeBase), (s) => s.optional());

const createEvaluationStageSchema = Joi.object(evaluationStageBase);
const updateEvaluationStageSchema = Joi.object(evaluationStageBase).fork(Object.keys(evaluationStageBase), (s) => s.optional());

module.exports = {
  createAssetSchema,
  updateAssetSchema,
  createAccountTypeSchema,
  updateAccountTypeSchema,
  createEvaluationStageSchema,
  updateEvaluationStageSchema,
};
