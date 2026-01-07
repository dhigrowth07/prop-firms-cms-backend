const { Firm, FuturesProgram, AccountType, Rule, PayoutPolicy, FirmCoupon, TradingPlatform, Broker, PayoutMethod, PaymentMethod, Asset, Country, sequelize } = require("../config/connectDB");
const { QueryTypes } = require("sequelize");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createFirm = async (req, res) => {
  try {
    const firm = await Firm.create(req.body);
    return successResponse(res, "Firm created successfully", 201, { firm });
  } catch (err) {
    return errorResponse(res, "Failed to create firm", 500, err);
  }
};

const updateFirm = async (req, res) => {
  try {
    const { id } = req.params;
    const firm = await Firm.findByPk(id);

    if (!firm) {
      return errorResponse(res, "Firm not found", 404);
    }

    // Extract association arrays from body
    const { trading_platform_ids, broker_ids, payout_method_ids, payment_method_ids, asset_ids, restricted_country_ids, ...firmData } = req.body;

    // Update firm basic data first
    if (Object.keys(firmData).length > 0) {
      await firm.update(firmData);
    }

    // Handle many-to-many associations if provided
    // Sequelize preserves underscores in alias names for method names
    if (trading_platform_ids && Array.isArray(trading_platform_ids)) {
      const platforms = await TradingPlatform.findAll({ where: { id: trading_platform_ids } });
      if (platforms && platforms.length > 0) {
        await firm.setTrading_platforms(platforms);
        console.log(`Set ${platforms.length} trading platform(s) for firm ${id}`);
      } else {
        console.warn(`No trading platforms found for IDs: ${trading_platform_ids.join(", ")}`);
      }
    }
    if (broker_ids && Array.isArray(broker_ids)) {
      const brokers = await Broker.findAll({ where: { id: broker_ids } });
      if (brokers && brokers.length > 0) {
        await firm.setBrokers(brokers);
        console.log(`Set ${brokers.length} broker(s) for firm ${id}`);
      } else {
        console.warn(`No brokers found for IDs: ${broker_ids.join(", ")}`);
      }
    }
    if (payout_method_ids && Array.isArray(payout_method_ids)) {
      const payoutMethods = await PayoutMethod.findAll({ where: { id: payout_method_ids } });
      if (payoutMethods && payoutMethods.length > 0) {
        await firm.setPayout_methods(payoutMethods);
        console.log(`Set ${payoutMethods.length} payout method(s) for firm ${id}`);
      } else {
        console.warn(`No payout methods found for IDs: ${payout_method_ids.join(", ")}`);
      }
    }
    if (payment_method_ids && Array.isArray(payment_method_ids)) {
      const paymentMethods = await PaymentMethod.findAll({ where: { id: payment_method_ids } });
      if (paymentMethods && paymentMethods.length > 0) {
        await firm.setPayment_methods(paymentMethods);
        console.log(`Set ${paymentMethods.length} payment method(s) for firm ${id}`);
      } else {
        console.warn(`No payment methods found for IDs: ${payment_method_ids.join(", ")}`);
      }
    }
    if (asset_ids && Array.isArray(asset_ids)) {
      const assets = await Asset.findAll({ where: { id: asset_ids } });
      if (assets && assets.length > 0) {
        await firm.setAssets(assets);
        console.log(`Set ${assets.length} asset(s) for firm ${id}`);
      } else {
        console.warn(`No assets found for IDs: ${asset_ids.join(", ")}`);
      }
    }
    if (restricted_country_ids && Array.isArray(restricted_country_ids)) {
      const countries = await Country.findAll({ where: { id: restricted_country_ids } });
      if (countries && countries.length > 0) {
        await firm.setRestricted_countries(countries);
        console.log(`Set ${countries.length} restricted countr(y/ies) for firm ${id}`);
      } else {
        console.warn(`No countries found for IDs: ${restricted_country_ids.join(", ")}`);
      }
    }

    // Reload firm with associations - need to reload from database after setting associations
    const updatedFirm = await Firm.findByPk(id, {
      include: [
        {
          model: TradingPlatform,
          as: "trading_platforms",
          required: false,
          through: { attributes: [] }, // Exclude junction table attributes
          attributes: ["id", "name", "slug", "logo_url", "website_url", "category"],
        },
        {
          model: Broker,
          as: "brokers",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url", "website_url", "broker_type"],
        },
        {
          model: PayoutMethod,
          as: "payout_methods",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url"],
        },
        {
          model: PaymentMethod,
          as: "payment_methods",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url"],
        },
        {
          model: Asset,
          as: "assets",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
        {
          model: Country,
          as: "restricted_countries",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "code", "flag_url"],
        },
      ],
    });

    return successResponse(res, "Firm updated successfully", 200, { firm: updatedFirm });
  } catch (err) {
    return errorResponse(res, "Failed to update firm", 500, err);
  }
};

const getFirmById = async (req, res) => {
  try {
    const { id } = req.params;
    const firm = await Firm.findByPk(id);

    if (!firm) {
      return errorResponse(res, "Firm not found", 404);
    }

    return successResponse(res, "Firm fetched successfully", 200, { firm });
  } catch (err) {
    return errorResponse(res, "Failed to fetch firm", 500, err);
  }
};

const listFirms = async (req, res) => {
  try {
    const firms = await Firm.findAll();
    return successResponse(res, "Firms fetched successfully", 200, { firms });
  } catch (err) {
    return errorResponse(res, "Failed to fetch firms", 500, err);
  }
};

const toggleFirmActive = async (req, res) => {
  try {
    const { id } = req.params;
    const firm = await Firm.findByPk(id);

    if (!firm) {
      return errorResponse(res, "Firm not found", 404);
    }

    firm.is_active = !firm.is_active;
    await firm.save();

    return successResponse(res, "Firm status updated successfully", 200, { firm });
  } catch (err) {
    return errorResponse(res, "Failed to update firm status", 500, err);
  }
};

const deleteFirm = async (req, res) => {
  try {
    const { id } = req.params;
    const firm = await Firm.findByPk(id);

    if (!firm) {
      return errorResponse(res, "Firm not found", 404);
    }

    // Check associations before deletion
    const [futuresProgramsCount] = await sequelize.query(`SELECT COUNT(*) as count FROM futures_programs WHERE firm_id = :firmId`, { replacements: { firmId: id }, type: QueryTypes.SELECT });

    const [accountTypesCount] = await sequelize.query(`SELECT COUNT(*) as count FROM account_types WHERE firm_id = :firmId`, { replacements: { firmId: id }, type: QueryTypes.SELECT });

    const [rulesCount] = await sequelize.query(`SELECT COUNT(*) as count FROM rules WHERE firm_id = :firmId`, { replacements: { firmId: id }, type: QueryTypes.SELECT });

    const [payoutPoliciesCount] = await sequelize.query(`SELECT COUNT(*) as count FROM payout_policies WHERE firm_id = :firmId`, { replacements: { firmId: id }, type: QueryTypes.SELECT });

    const [firmCouponsCount] = await sequelize.query(`SELECT COUNT(*) as count FROM firm_coupons WHERE firm_id = :firmId`, { replacements: { firmId: id }, type: QueryTypes.SELECT });

    const futuresProgramsCountValue = Array.isArray(futuresProgramsCount) && futuresProgramsCount[0] && typeof futuresProgramsCount[0].count === "number" ? futuresProgramsCount[0].count : 0;
    const accountTypesCountValue = Array.isArray(accountTypesCount) && accountTypesCount[0] && typeof accountTypesCount[0].count === "number" ? accountTypesCount[0].count : 0;
    const rulesCountValue = Array.isArray(rulesCount) && rulesCount[0] && typeof rulesCount[0].count === "number" ? rulesCount[0].count : 0;
    const payoutPoliciesCountValue = Array.isArray(payoutPoliciesCount) && payoutPoliciesCount[0] && typeof payoutPoliciesCount[0].count === "number" ? payoutPoliciesCount[0].count : 0;
    const firmCouponsCountValue = Array.isArray(firmCouponsCount) && firmCouponsCount[0] && typeof firmCouponsCount[0].count === "number" ? firmCouponsCount[0].count : 0;

    const associations = {
      futuresPrograms: parseInt(futuresProgramsCountValue),
      accountTypes: parseInt(accountTypesCountValue),
      rules: parseInt(rulesCountValue),
      payoutPolicies: parseInt(payoutPoliciesCountValue),
      coupons: parseInt(firmCouponsCountValue),
    };

    const totalAssociations = Object.values(associations).reduce((sum, count) => sum + count, 0);

    if (totalAssociations > 0) {
      return errorResponse(res, `Cannot delete firm: It has associated records. Please remove all associations first.`, 400, null, { associations });
    }

    // Remove many-to-many associations first
    await sequelize.query(`DELETE FROM firm_trading_platforms WHERE firm_id = :firmId`, {
      replacements: { firmId: id },
    });
    await sequelize.query(`DELETE FROM firm_brokers WHERE firm_id = :firmId`, {
      replacements: { firmId: id },
    });
    await sequelize.query(`DELETE FROM firm_payout_methods WHERE firm_id = :firmId`, {
      replacements: { firmId: id },
    });
    await sequelize.query(`DELETE FROM firm_payment_methods WHERE firm_id = :firmId`, {
      replacements: { firmId: id },
    });
    await sequelize.query(`DELETE FROM firm_futures_exchanges WHERE firm_id = :firmId`, {
      replacements: { firmId: id },
    });
    await sequelize.query(`DELETE FROM firm_assets WHERE firm_id = :firmId`, {
      replacements: { firmId: id },
    });
    await sequelize.query(`DELETE FROM firm_restricted_countries WHERE firm_id = :firmId`, {
      replacements: { firmId: id },
    });

    // Delete the firm
    await firm.destroy();

    return successResponse(res, "Firm deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete firm", 500, err);
  }
};

module.exports = {
  createFirm,
  updateFirm,
  getFirmById,
  listFirms,
  toggleFirmActive,
  deleteFirm,
};
