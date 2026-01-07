const {
  Firm,
  TradingPlatform,
  Broker,
  PayoutMethod,
  PaymentMethod,
  FuturesExchange,
  FuturesProgram,
  Asset,
  AccountType,
  EvaluationStage,
  Rule,
  PayoutPolicy,
  Coupon,
  InstrumentType,
  Country,
  Commission,
  sequelize,
} = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { Op, QueryTypes } = require("sequelize");

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

/**
 * Get list of active firms with optional firm_type filter, sorting, and filter presets
 * GET /api/v1/firms?firm_type=prop_firm|futures_firm&sort_by=rating&order=DESC&filter=top_rated
 * Filter presets: top_rated, most_reviewed, newest
 */
const listFirms = async (req, res) => {
  try {
    const { firm_type, sort_by, order, filter } = req.query;

    const whereClause = {
      is_active: true,
    };

    if (firm_type && (firm_type === "prop_firm" || firm_type === "futures_firm")) {
      whereClause.firm_type = firm_type;
    }

    // Determine sort order - filter presets take precedence over sort_by
    let orderBy = [["name", "ASC"]];

    if (filter) {
      // Handle filter presets
      switch (filter) {
        case "top_rated":
          orderBy = [
            ["rating", "DESC"],
            ["review_count", "DESC"],
          ];
          break;
        case "most_reviewed":
          orderBy = [
            ["review_count", "DESC"],
            ["rating", "DESC"],
          ];
          break;
        case "newest":
          orderBy = [["created_at", "DESC"]];
          break;
        default:
          // Invalid filter, use default
          break;
      }
    } else if (sort_by) {
      // Use custom sort_by if no filter preset
      const validSortFields = ["name", "rating", "review_count", "founded_year", "max_allocation", "created_at"];
      if (validSortFields.includes(sort_by)) {
        const sortOrder = order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";
        orderBy = [[sort_by, sortOrder]];
      }
    }

    const firms = await Firm.findAll({
      where: whereClause,
      include: [
        {
          model: TradingPlatform,
          as: "trading_platforms",
          where: { is_active: true },
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url", "website_url", "category"],
        },
        {
          model: Broker,
          as: "brokers",
          where: { is_active: true },
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url", "website_url", "broker_type"],
        },
        {
          model: PayoutMethod,
          as: "payout_methods",
          where: { is_active: true },
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url"],
        },
        {
          model: PaymentMethod,
          as: "payment_methods",
          where: { is_active: true },
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
      order: orderBy,
    });

    // Calculate years_in_business and format response
    const currentYear = new Date().getFullYear();
    const firmsData = firms.map((firm) => {
      const firmData = firm.toJSON();

      // Calculate years in business
      if (firmData.founded_year) {
        firmData.years_in_business = currentYear - firmData.founded_year;
      } else {
        firmData.years_in_business = null;
      }

      return firmData;
    });

    return successResponse(res, "Firms fetched successfully", 200, { firms: firmsData, count: firmsData.length });
  } catch (err) {
    return errorResponse(res, "Failed to fetch firms", 500, err);
  }
};

/**
 * Get firm details by slug with all related data
 * GET /api/v1/firms/:slug
 */
const getFirmBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const firm = await Firm.findOne({
      where: {
        slug,
        is_active: true,
      },
      include: [
        // Global references (all firm types)
        {
          model: TradingPlatform,
          as: "trading_platforms",
          where: { is_active: true },
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url", "website_url", "category"],
        },
        {
          model: Broker,
          as: "brokers",
          where: { is_active: true },
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url", "website_url", "broker_type"],
        },
        {
          model: PayoutMethod,
          as: "payout_methods",
          where: { is_active: true },
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "logo_url"],
        },
        {
          model: PaymentMethod,
          as: "payment_methods",
          where: { is_active: true },
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

    // Filter coupons based on display rules
    const firmData = firm.toJSON();
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
      const ungroupedPolicies = [];

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

      // Keep original payout_policies array for backward compatibility
      // firmData.payout_policies remains unchanged
    } else {
      firmData.payout_policies_grouped = [];
    }

    // Load firm-type-specific data
    if (firm.firm_type === "futures_firm") {
      // Futures-specific includes - get exchanges via junction table
      const [futuresExchangesRows] = await sequelize.query(
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

      firmData.futures_exchanges = futuresExchangesRows || [];
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

    return successResponse(res, "Firm details fetched successfully", 200, { firm: firmData });
  } catch (err) {
    return errorResponse(res, "Failed to fetch firm details", 500, err);
  }
};

module.exports = {
  listFirms,
  getFirmBySlug,
  filterActiveCoupons,
};
