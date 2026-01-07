const Joi = require("joi");

const instrumentTypeBase = {
  name: Joi.string().max(255).required(),
  description: Joi.string().allow("", null),
};

const futuresExchangeBase = {
  name: Joi.string().max(255).required(),
  code: Joi.string().max(50).required(),
};

const futuresProgramBase = {
  firm_id: Joi.string().uuid().required(),
  name: Joi.string().max(255).required(),
  account_size: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),
  profit_target: Joi.number().required(),
  max_drawdown: Joi.number().required(),
  trailing_drawdown: Joi.boolean().default(false),
  reset_fee: Joi.number().min(0).allow(null),
  notes: Joi.string().allow("", null),
};

const createInstrumentTypeSchema = Joi.object(instrumentTypeBase);
const updateInstrumentTypeSchema = Joi.object(instrumentTypeBase).fork(
  Object.keys(instrumentTypeBase),
  (s) => s.optional()
);

const createFuturesExchangeSchema = Joi.object(futuresExchangeBase);
const updateFuturesExchangeSchema = Joi.object(futuresExchangeBase).fork(
  Object.keys(futuresExchangeBase),
  (s) => s.optional()
);

const createFuturesProgramSchema = Joi.object(futuresProgramBase);
const updateFuturesProgramSchema = Joi.object(futuresProgramBase).fork(
  Object.keys(futuresProgramBase),
  (s) => s.optional()
);

module.exports = {
  createInstrumentTypeSchema,
  updateInstrumentTypeSchema,
  createFuturesExchangeSchema,
  updateFuturesExchangeSchema,
  createFuturesProgramSchema,
  updateFuturesProgramSchema,
};


