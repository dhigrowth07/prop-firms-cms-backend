const { PayoutMethod, sequelize } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createPayoutMethod = async (req, res) => {
  try {
    const payoutMethod = await PayoutMethod.create(req.body);
    return successResponse(res, "Payout method created successfully", 201, { payoutMethod });
  } catch (err) {
    return errorResponse(res, "Failed to create payout method", 500, err);
  }
};

const updatePayoutMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const payoutMethod = await PayoutMethod.findByPk(id);

    if (!payoutMethod) {
      return errorResponse(res, "Payout method not found", 404);
    }

    await payoutMethod.update(req.body);
    return successResponse(res, "Payout method updated successfully", 200, { payoutMethod });
  } catch (err) {
    return errorResponse(res, "Failed to update payout method", 500, err);
  }
};

const listPayoutMethods = async (req, res) => {
  try {
    const payoutMethods = await PayoutMethod.findAll();
    return successResponse(res, "Payout methods fetched successfully", 200, { payoutMethods });
  } catch (err) {
    return errorResponse(res, "Failed to fetch payout methods", 500, err);
  }
};

const togglePayoutMethodActive = async (req, res) => {
  try {
    const { id } = req.params;
    const payoutMethod = await PayoutMethod.findByPk(id);

    if (!payoutMethod) {
      return errorResponse(res, "Payout method not found", 404);
    }

    payoutMethod.is_active = !payoutMethod.is_active;
    await payoutMethod.save();

    return successResponse(res, "Payout method status updated successfully", 200, { payoutMethod });
  } catch (err) {
    return errorResponse(res, "Failed to update payout method status", 500, err);
  }
};

const deletePayoutMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const payoutMethod = await PayoutMethod.findByPk(id);

    if (!payoutMethod) {
      return errorResponse(res, "Payout method not found", 404);
    }

    // Check if any firms are using this payout method
    const [firmsCount] = await sequelize.query(
      `SELECT COUNT(*) as count FROM firm_payout_methods WHERE payout_method_id = :payoutMethodId`,
      { replacements: { payoutMethodId: id }, type: sequelize.QueryTypes.SELECT }
    );

    if (parseInt(firmsCount.count) > 0) {
      return errorResponse(
        res,
        `Cannot delete payout method: It is associated with ${firmsCount.count} firm(s). Please remove associations first.`,
        400
      );
    }

    await payoutMethod.destroy();
    return successResponse(res, "Payout method deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete payout method", 500, err);
  }
};

module.exports = {
  createPayoutMethod,
  updatePayoutMethod,
  listPayoutMethods,
  togglePayoutMethodActive,
  deletePayoutMethod,
};


