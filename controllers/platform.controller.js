const { TradingPlatform, sequelize } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createPlatform = async (req, res) => {
  try {
    const platform = await TradingPlatform.create(req.body);
    return successResponse(res, "Trading platform created successfully", 201, { platform });
  } catch (err) {
    return errorResponse(res, "Failed to create trading platform", 500, err);
  }
};

const updatePlatform = async (req, res) => {
  try {
    const { id } = req.params;
    const platform = await TradingPlatform.findByPk(id);

    if (!platform) {
      return errorResponse(res, "Trading platform not found", 404);
    }

    await platform.update(req.body);
    return successResponse(res, "Trading platform updated successfully", 200, { platform });
  } catch (err) {
    return errorResponse(res, "Failed to update trading platform", 500, err);
  }
};

const listPlatforms = async (req, res) => {
  try {
    const platforms = await TradingPlatform.findAll();
    return successResponse(res, "Trading platforms fetched successfully", 200, { platforms });
  } catch (err) {
    return errorResponse(res, "Failed to fetch trading platforms", 500, err);
  }
};

const togglePlatformActive = async (req, res) => {
  try {
    const { id } = req.params;
    const platform = await TradingPlatform.findByPk(id);

    if (!platform) {
      return errorResponse(res, "Trading platform not found", 404);
    }

    platform.is_active = !platform.is_active;
    await platform.save();

    return successResponse(res, "Trading platform status updated successfully", 200, { platform });
  } catch (err) {
    return errorResponse(res, "Failed to update trading platform status", 500, err);
  }
};

const deletePlatform = async (req, res) => {
  try {
    const { id } = req.params;
    const platform = await TradingPlatform.findByPk(id);

    if (!platform) {
      return errorResponse(res, "Trading platform not found", 404);
    }

    // Check if any firms are using this platform
    const [firmsCount] = await sequelize.query(
      `SELECT COUNT(*) as count FROM firm_trading_platforms WHERE trading_platform_id = :platformId`,
      { replacements: { platformId: id }, type: sequelize.QueryTypes.SELECT }
    );

    if (parseInt(firmsCount.count) > 0) {
      return errorResponse(
        res,
        `Cannot delete trading platform: It is associated with ${firmsCount.count} firm(s). Please remove associations first.`,
        400
      );
    }

    await platform.destroy();
    return successResponse(res, "Trading platform deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete trading platform", 500, err);
  }
};

module.exports = {
  createPlatform,
  updatePlatform,
  listPlatforms,
  togglePlatformActive,
  deletePlatform,
};


