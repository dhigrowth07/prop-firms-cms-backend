const { Rule, PayoutPolicy } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const listRules = async (req, res) => {
  try {
    const rules = await Rule.findAll();
    return successResponse(res, "Rules fetched successfully", 200, { rules });
  } catch (err) {
    return errorResponse(res, "Failed to fetch rules", 500, err);
  }
};

const createRule = async (req, res) => {
  try {
    const rule = await Rule.create(req.body);
    return successResponse(res, "Rule created successfully", 201, { rule });
  } catch (err) {
    return errorResponse(res, "Failed to create rule", 500, err);
  }
};

const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await Rule.findByPk(id);
    if (!rule) {
      return errorResponse(res, "Rule not found", 404);
    }
    await rule.update(req.body);
    return successResponse(res, "Rule updated successfully", 200, { rule });
  } catch (err) {
    return errorResponse(res, "Failed to update rule", 500, err);
  }
};

const listPayoutPolicies = async (req, res) => {
  try {
    const payoutPolicies = await PayoutPolicy.findAll();
    return successResponse(res, "Payout policies fetched successfully", 200, { payoutPolicies });
  } catch (err) {
    return errorResponse(res, "Failed to fetch payout policies", 500, err);
  }
};

const createPayoutPolicy = async (req, res) => {
  try {
    const payoutPolicy = await PayoutPolicy.create(req.body);
    return successResponse(res, "Payout policy created successfully", 201, { payoutPolicy });
  } catch (err) {
    return errorResponse(res, "Failed to create payout policy", 500, err);
  }
};

const updatePayoutPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const payoutPolicy = await PayoutPolicy.findByPk(id);
    if (!payoutPolicy) {
      return errorResponse(res, "Payout policy not found", 404);
    }
    await payoutPolicy.update(req.body);
    return successResponse(res, "Payout policy updated successfully", 200, { payoutPolicy });
  } catch (err) {
    return errorResponse(res, "Failed to update payout policy", 500, err);
  }
};

const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await Rule.findByPk(id);

    if (!rule) {
      return errorResponse(res, "Rule not found", 404);
    }

    // Rule belongs to Firm, but can be deleted directly
    await rule.destroy();
    return successResponse(res, "Rule deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete rule", 500, err);
  }
};

const deletePayoutPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const payoutPolicy = await PayoutPolicy.findByPk(id);

    if (!payoutPolicy) {
      return errorResponse(res, "Payout policy not found", 404);
    }

    // PayoutPolicy belongs to Firm, but can be deleted directly
    await payoutPolicy.destroy();
    return successResponse(res, "Payout policy deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete payout policy", 500, err);
  }
};

module.exports = {
  listRules,
  createRule,
  updateRule,
  listPayoutPolicies,
  createPayoutPolicy,
  updatePayoutPolicy,
  deleteRule,
  deletePayoutPolicy,
};
