const {
  Firm,
  Coupon,
  User,
  TradingPlatform,
  Broker,
  sequelize,
} = require("../config/connectDB");
const { Op } = require("sequelize");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * Get Dashboard Statistics
 * Provides a summary of firms, users, coupons, and content health
 */
const getDashboardStats = async (req, res) => {
  try {
    // 1. Firm Stats
    const totalFirms = await Firm.count();
    const activeFirms = await Firm.count({ where: { is_active: true } });
    const inactiveFirms = totalFirms - activeFirms;
    
    const propFirms = await Firm.count({ where: { firm_type: "prop_firm" } });
    const futuresFirms = await Firm.count({ where: { firm_type: "futures_firm" } });

    // 2. Coupon Stats
    const now = new Date();
    const activeCoupons = await Coupon.count({
      where: {
        is_active: true,
        [Op.or]: [
          { start_date: null },
          { start_date: { [Op.lte]: now } }
        ],
        [Op.or]: [
          { end_date: null },
          { end_date: { [Op.gt]: now } }
        ]
      }
    });

    // 3. User Stats
    const totalUsers = await User.count();
    const adminUsers = await User.count({ where: { role: "ADMIN" } });
    const editorUsers = totalUsers - adminUsers;

    // 4. Content Infrastructure Stats
    const totalPlatforms = await TradingPlatform.count();
    const totalBrokers = await Broker.count();

    // 5. Recent Activity (Latest Updated Firms)
    const recentFirms = await Firm.findAll({
      limit: 5,
      order: [["updated_at", "DESC"]],
      attributes: ["id", "name", "slug", "logo_url", "updated_at", "is_active"]
    });

    // 6. Critical Data Gaps (Firms missing description, rating, or logo)
    const firmsWithGaps = await Firm.findAll({
      where: {
        [Op.or]: [
          { description: null },
          { description: "" },
          { rating: null },
          { rating: 0 },
          { logo_url: null },
          { logo_url: "" }
        ]
      },
      limit: 10,
      attributes: ["id", "name", "slug", "is_active"]
    });

    return successResponse(res, "Dashboard stats fetched successfully", 200, {
      firms: {
        total: totalFirms,
        active: activeFirms,
        inactive: inactiveFirms,
        prop: propFirms,
        futures: futuresFirms
      },
      coupons: {
        active: activeCoupons
      },
      users: {
        total: totalUsers,
        admins: adminUsers,
        editors: editorUsers
      },
      infrastructure: {
        platforms: totalPlatforms,
        brokers: totalBrokers
      },
      recentActivity: recentFirms,
      dataGaps: firmsWithGaps
    });
  } catch (err) {
    console.error(`[getDashboardStats] Error:`, err);
    return errorResponse(res, "Failed to fetch dashboard stats", 500, err);
  }
};

module.exports = {
  getDashboardStats,
};
