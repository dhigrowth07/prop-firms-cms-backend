const {
  Firm,
  FuturesProgram,
  AccountType,
  Rule,
  PayoutPolicy,
  FirmCoupon,
  TradingPlatform,
  Broker,
  PayoutMethod,
  PaymentMethod,
  Asset,
  Country,
  Coupon,
  EvaluationStage,
  Commission,
  InstrumentType,
  FuturesExchange,
  sequelize,
} = require("../config/connectDB");
const { QueryTypes } = require("sequelize");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * Filter coupons based on display-only rules:
 * - is_active = true
 * - start_date <= NOW() OR start_date IS NULL
 * - end_date > NOW() OR end_date IS NULL
 */
const filterActiveCoupons = (coupons) => {
  if (!coupons || !Array.isArray(coupons)) return [];
  const now = new Date();
  return coupons.filter((coupon) => {
    if (!coupon.is_active) return false;
    if (coupon.start_date && new Date(coupon.start_date) > now) return false;
    if (coupon.end_date && new Date(coupon.end_date) <= now) return false;
    return true;
  });
};

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

    // Reload firm with all associations - same as getFirmById
    const updatedFirm = await Firm.findOne({
      where: { id },
      include: [
        // Global references (all firm types)
        {
          model: TradingPlatform,
          as: "trading_platforms",
          required: false,
          through: { attributes: [] },
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
        // Rules and policies (all firm types)
        {
          model: Rule,
          as: "rules",
          required: false,
          attributes: ["id", "category", "title", "description", "created_at", "updated_at"],
        },
        {
          model: PayoutPolicy,
          as: "payout_policies",
          required: false,
          attributes: ["id", "payout_frequency", "first_payout_days", "profit_split_initial", "profit_split_max", "notes", "program_type", "created_at", "updated_at"],
        },
        // Coupons (filtered by display rules)
        {
          model: Coupon,
          as: "coupons",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "code", "discount_text", "discount_value", "discount_type", "description", "start_date", "end_date", "is_active"],
        },
        {
          model: Country,
          as: "restricted_countries",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "code", "flag_url"],
        },
      ],
      attributes: [
        "id",
        "name",
        "slug",
        "firm_type",
        "logo_url",
        "founded_year",
        "rating",
        "review_count",
        "max_allocation",
        "description",
        "location",
        "guide_video_url",
        "is_active",
        "created_at",
        "updated_at",
      ],
    });

    if (!updatedFirm) {
      return errorResponse(res, "Firm not found after update", 404);
    }

    // Apply same post-processing as getFirmById
    const responseData = updatedFirm.toJSON();
    responseData.coupons = filterActiveCoupons(responseData.coupons);

    // Calculate years in business
    const currentYear = new Date().getFullYear();
    if (responseData.founded_year) {
      responseData.years_in_business = currentYear - responseData.founded_year;
    } else {
      responseData.years_in_business = null;
    }

    // Separate consistency rules from other rules
    if (responseData.rules && Array.isArray(responseData.rules)) {
      responseData.consistency_rules = responseData.rules.filter((rule) => rule.category === "consistency");
      responseData.firm_rules = responseData.rules.filter((rule) => rule.category !== "consistency");
    } else {
      responseData.consistency_rules = [];
      responseData.firm_rules = [];
    }

    // Group payout policies by program_type
    if (responseData.payout_policies && Array.isArray(responseData.payout_policies)) {
      const groupedPayoutPolicies = {};

      responseData.payout_policies.forEach((policy) => {
        const programType = policy.program_type || "General";
        if (!groupedPayoutPolicies[programType]) {
          groupedPayoutPolicies[programType] = [];
        }
        groupedPayoutPolicies[programType].push(policy);
      });

      // Convert to array format: [{ program_type: "1-Step", policies: [...] }, ...]
      responseData.payout_policies_grouped = Object.keys(groupedPayoutPolicies).map((programType) => ({
        program_type: programType,
        policies: groupedPayoutPolicies[programType],
      }));
    } else {
      responseData.payout_policies_grouped = [];
    }

    // Load firm-type-specific data
    if (updatedFirm.firm_type === "futures_firm") {
      // Futures-specific includes - get exchanges via junction table
      const futuresExchangesRows = await sequelize.query(
        `SELECT fe.id, fe.name, fe.code 
         FROM futures_exchanges fe
         INNER JOIN firm_futures_exchanges ffe ON fe.id = ffe.futures_exchange_id
         WHERE ffe.firm_id = :firmId`,
        { replacements: { firmId: updatedFirm.id }, type: QueryTypes.SELECT }
      );

      const futuresPrograms = await FuturesProgram.findAll({
        where: { firm_id: updatedFirm.id },
        include: [
          {
            model: Commission,
            as: "commissions",
            required: false,
            attributes: ["id", "asset_name", "commission_type", "commission_value", "commission_text", "notes"],
          },
        ],
        attributes: ["id", "name", "account_size", "price", "profit_target", "max_drawdown", "trailing_drawdown", "reset_fee", "notes", "created_at", "updated_at"],
        order: [["account_size", "ASC"]],
      });

      const instrumentTypes = await InstrumentType.findAll({
        attributes: ["id", "name", "description"],
      });

      responseData.futures_exchanges = Array.isArray(futuresExchangesRows) ? futuresExchangesRows : [];
      responseData.futures_programs = futuresPrograms.map((fp) => fp.toJSON());
      responseData.instrument_types = instrumentTypes.map((it) => it.toJSON());
    } else if (updatedFirm.firm_type === "prop_firm") {
      // Prop-specific includes - get assets via junction table
      const assetsRows = await sequelize.query(
        `SELECT a.id, a.name 
         FROM assets a
         INNER JOIN firm_assets fa ON a.id = fa.asset_id
         WHERE fa.firm_id = :firmId`,
        { replacements: { firmId: updatedFirm.id }, type: QueryTypes.SELECT }
      );

      const accountTypes = await AccountType.findAll({
        where: { firm_id: updatedFirm.id },
        include: [
          {
            model: EvaluationStage,
            as: "evaluation_stages",
            required: false,
            attributes: ["id", "stage_number", "profit_target", "max_daily_loss", "max_total_loss", "min_trading_days", "created_at", "updated_at"],
            order: [["stage_number", "ASC"]],
          },
          {
            model: Commission,
            as: "commissions",
            required: false,
            attributes: ["id", "asset_name", "commission_type", "commission_value", "commission_text", "notes"],
          },
        ],
        attributes: [
          "id",
          "name",
          "starting_balance",
          "price",
          "profit_target",
          "daily_drawdown",
          "max_drawdown",
          "profit_split",
          "evaluation_required",
          "program_variant",
          "program_name",
          "created_at",
          "updated_at",
        ],
        order: [["starting_balance", "ASC"]],
      });

      // Ensure assets is always an array (QueryTypes.SELECT returns array of results)
      responseData.assets = Array.isArray(assetsRows) ? assetsRows : [];
      responseData.account_types = accountTypes.map((at) => at.toJSON());
    }
    console.log(`[updateFirm] responseData:`, responseData);

    console.log(`[updateFirm] Returning firm data with keys:`, Object.keys(responseData));

    return successResponse(res, "Firm updated successfully", 200, { firm: responseData });
  } catch (err) {
    return errorResponse(res, "Failed to update firm", 500, err);
  }
};

const getFirmById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[getFirmById] Fetching firm with id: ${id}`);
    const firm = await Firm.findOne({
      where: { id },
      include: [
        // Global references (all firm types)
        {
          model: TradingPlatform,
          as: "trading_platforms",
          required: false,
          through: { attributes: [] },
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
        // Rules and policies (all firm types)
        {
          model: Rule,
          as: "rules",
          required: false,
          attributes: ["id", "category", "title", "description", "created_at", "updated_at"],
        },
        {
          model: PayoutPolicy,
          as: "payout_policies",
          required: false,
          attributes: ["id", "payout_frequency", "first_payout_days", "profit_split_initial", "profit_split_max", "notes", "program_type", "created_at", "updated_at"],
        },
        // Coupons (filtered by display rules)
        {
          model: Coupon,
          as: "coupons",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "code", "discount_text", "discount_value", "discount_type", "description", "start_date", "end_date", "is_active"],
        },
        {
          model: Country,
          as: "restricted_countries",
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "code", "flag_url"],
        },
      ],
      attributes: [
        "id",
        "name",
        "slug",
        "firm_type",
        "logo_url",
        "founded_year",
        "rating",
        "review_count",
        "max_allocation",
        "description",
        "location",
        "guide_video_url",
        "is_active",
        "created_at",
        "updated_at",
      ],
    });

    if (!firm) {
      return errorResponse(res, "Firm not found", 404);
    }

    console.log(`[getFirmById] Firm found: ${firm.name}, type: ${firm.firm_type}`);
    // Filter coupons based on display rules
    const firmData = firm.toJSON();
    console.log(`[getFirmById] Firm data keys:`, Object.keys(firmData));
    firmData.coupons = filterActiveCoupons(firmData.coupons);

    // Calculate years in business
    const currentYear = new Date().getFullYear();
    if (firmData.founded_year) {
      firmData.years_in_business = currentYear - firmData.founded_year;
    } else {
      firmData.years_in_business = null;
    }

    // Separate consistency rules from other rules
    if (firmData.rules && Array.isArray(firmData.rules)) {
      firmData.consistency_rules = firmData.rules.filter((rule) => rule.category === "consistency");
      firmData.firm_rules = firmData.rules.filter((rule) => rule.category !== "consistency");
    } else {
      firmData.consistency_rules = [];
      firmData.firm_rules = [];
    }

    // Group payout policies by program_type
    if (firmData.payout_policies && Array.isArray(firmData.payout_policies)) {
      const groupedPayoutPolicies = {};

      firmData.payout_policies.forEach((policy) => {
        const programType = policy.program_type || "General";
        if (!groupedPayoutPolicies[programType]) {
          groupedPayoutPolicies[programType] = [];
        }
        groupedPayoutPolicies[programType].push(policy);
      });

      // Convert to array format: [{ program_type: "1-Step", policies: [...] }, ...]
      firmData.payout_policies_grouped = Object.keys(groupedPayoutPolicies).map((programType) => ({
        program_type: programType,
        policies: groupedPayoutPolicies[programType],
      }));
    } else {
      firmData.payout_policies_grouped = [];
    }

    // Load firm-type-specific data
    if (firm.firm_type === "futures_firm") {
      // Futures-specific includes - get exchanges via junction table
      const futuresExchangesRows = await sequelize.query(
        `SELECT fe.id, fe.name, fe.code 
         FROM futures_exchanges fe
         INNER JOIN firm_futures_exchanges ffe ON fe.id = ffe.futures_exchange_id
         WHERE ffe.firm_id = :firmId`,
        { replacements: { firmId: firm.id }, type: QueryTypes.SELECT }
      );

      const futuresPrograms = await FuturesProgram.findAll({
        where: { firm_id: firm.id },
        include: [
          {
            model: Commission,
            as: "commissions",
            required: false,
            attributes: ["id", "asset_name", "commission_type", "commission_value", "commission_text", "notes"],
          },
        ],
        attributes: ["id", "name", "account_size", "price", "profit_target", "max_drawdown", "trailing_drawdown", "reset_fee", "notes", "created_at", "updated_at"],
        order: [["account_size", "ASC"]],
      });

      const instrumentTypes = await InstrumentType.findAll({
        attributes: ["id", "name", "description"],
      });

      firmData.futures_exchanges = Array.isArray(futuresExchangesRows) ? futuresExchangesRows : [];
      firmData.futures_programs = futuresPrograms;
      firmData.instrument_types = instrumentTypes;
    } else if (firm.firm_type === "prop_firm") {
      // Prop-specific includes - get assets via junction table
      const assetsRows = await sequelize.query(
        `SELECT a.id, a.name 
         FROM assets a
         INNER JOIN firm_assets fa ON a.id = fa.asset_id
         WHERE fa.firm_id = :firmId`,
        { replacements: { firmId: firm.id }, type: QueryTypes.SELECT }
      );

      const accountTypes = await AccountType.findAll({
        where: { firm_id: firm.id },
        include: [
          {
            model: EvaluationStage,
            as: "evaluation_stages",
            required: false,
            attributes: ["id", "stage_number", "profit_target", "max_daily_loss", "max_total_loss", "min_trading_days", "created_at", "updated_at"],
            order: [["stage_number", "ASC"]],
          },
          {
            model: Commission,
            as: "commissions",
            required: false,
            attributes: ["id", "asset_name", "commission_type", "commission_value", "commission_text", "notes"],
          },
        ],
        attributes: [
          "id",
          "name",
          "starting_balance",
          "price",
          "profit_target",
          "daily_drawdown",
          "max_drawdown",
          "profit_split",
          "evaluation_required",
          "program_variant",
          "program_name",
          "created_at",
          "updated_at",
        ],
        order: [["starting_balance", "ASC"]],
      });

      // Ensure assets is always an array (QueryTypes.SELECT returns array of results)
      firmData.assets = Array.isArray(assetsRows) ? assetsRows : [];
      firmData.account_types = accountTypes;
    }

    console.log(`[getFirmById] Returning firm data with keys:`, Object.keys(firmData));
    console.log(`[getFirmById] Has trading_platforms:`, !!firmData.trading_platforms);
    console.log(`[getFirmById] Has brokers:`, !!firmData.brokers);
    return successResponse(res, "Firm fetched successfully", 200, { firm: firmData });
  } catch (err) {
    console.error(`[getFirmById] Error:`, err);
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
