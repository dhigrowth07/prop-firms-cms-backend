const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = require("../config/env.config");
const logger = require("../utils/logger");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,
});

// Models
const Firm = require("../models/Firm.model")(sequelize);
const TradingPlatform = require("../models/TradingPlatform.model")(sequelize);
const Broker = require("../models/Broker.model")(sequelize);
const PayoutMethod = require("../models/PayoutMethod.model")(sequelize);
const PaymentMethod = require("../models/PaymentMethod.model")(sequelize);
const InstrumentType = require("../models/InstrumentType.model")(sequelize);
const FuturesExchange = require("../models/FuturesExchange.model")(sequelize);
const FuturesProgram = require("../models/FuturesProgram.model")(sequelize);
const Asset = require("../models/Asset.model")(sequelize);
const AccountType = require("../models/AccountType.model")(sequelize);
const EvaluationStage = require("../models/EvaluationStage.model")(sequelize);
const Rule = require("../models/Rule.model")(sequelize);
const PayoutPolicy = require("../models/PayoutPolicy.model")(sequelize);
const Coupon = require("../models/Coupon.model")(sequelize);
const FirmCoupon = require("../models/FirmCoupon.model")(sequelize);
const CouponAccountType = require("../models/CouponAccountType.model")(sequelize);
const User = require("../models/User.model")(sequelize);
const Country = require("../models/Country.model")(sequelize);
const Commission = require("../models/Commission.model")(sequelize);

const models = {
  Firm,
  TradingPlatform,
  Broker,
  PayoutMethod,
  PaymentMethod,
  InstrumentType,
  FuturesExchange,
  FuturesProgram,
  Asset,
  AccountType,
  EvaluationStage,
  Rule,
  PayoutPolicy,
  Coupon,
  FirmCoupon,
  CouponAccountType,
  User,
  Country,
  Commission,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

const connectDB = async (retries = 5, delay = 3000) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      logger.info("Connected to the database.");

      await sequelize.sync({ alter: false });
      logger.info(" All models were synchronized successfully.");
      return;
    } catch (error) {
      retries--;
      logger.error(` DB connection failed. Retries left: ${retries}.`);
      if (retries === 0) {
        logger.error("Could not connect after multiple attempts. Exiting..." + (error?.stack || error));
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

const syncModel = async (modelNames, options = { alter: true }) => {
  const modelList = Array.isArray(modelNames) ? modelNames : [modelNames];

  for (const name of modelList) {
    const model = models[name];
    if (!model) {
      logger.error(`Model "${name}" not found.`);
      continue;
    }
    try {
      await model.sync(options);
      logger.info(` Model "${name}" synchronized with options: ${JSON.stringify(options)}`);
    } catch (err) {
      logger.error(` Failed to sync model "${name}": ` + err.stack);
    }
  }
};

module.exports = {
  sequelize,
  connectDB,
  syncModel,
  ...models,
};
