const { Commission, AccountType, FuturesProgram } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const listCommissions = async (req, res) => {
  try {
    const { account_type_id, futures_program_id } = req.query;
    const whereClause = {};

    if (account_type_id) {
      whereClause.account_type_id = account_type_id;
    }
    if (futures_program_id) {
      whereClause.futures_program_id = futures_program_id;
    }

    const commissions = await Commission.findAll({
      where: whereClause,
      include: [
        {
          model: AccountType,
          as: "account_type",
          required: false,
          attributes: ["id", "name"],
        },
        {
          model: FuturesProgram,
          as: "futures_program",
          required: false,
          attributes: ["id", "name"],
        },
      ],
      order: [["asset_name", "ASC"]],
    });
    return successResponse(res, "Commissions fetched successfully", 200, { commissions });
  } catch (err) {
    return errorResponse(res, "Failed to fetch commissions", 500, err);
  }
};

const createCommission = async (req, res) => {
  try {
    const commission = await Commission.create(req.body);
    return successResponse(res, "Commission created successfully", 201, { commission });
  } catch (err) {
    return errorResponse(res, "Failed to create commission", 500, err);
  }
};

const updateCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const commission = await Commission.findByPk(id);
    if (!commission) {
      return errorResponse(res, "Commission not found", 404);
    }
    await commission.update(req.body);
    return successResponse(res, "Commission updated successfully", 200, { commission });
  } catch (err) {
    return errorResponse(res, "Failed to update commission", 500, err);
  }
};

const deleteCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const commission = await Commission.findByPk(id);

    if (!commission) {
      return errorResponse(res, "Commission not found", 404);
    }

    await commission.destroy();
    return successResponse(res, "Commission deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete commission", 500, err);
  }
};

module.exports = {
  listCommissions,
  createCommission,
  updateCommission,
  deleteCommission,
};

