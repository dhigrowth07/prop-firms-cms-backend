const { PaymentMethod, sequelize } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.create(req.body);
    return successResponse(res, "Payment method created successfully", 201, { paymentMethod });
  } catch (err) {
    return errorResponse(res, "Failed to create payment method", 500, err);
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findByPk(id);

    if (!paymentMethod) {
      return errorResponse(res, "Payment method not found", 404);
    }

    await paymentMethod.update(req.body);
    return successResponse(res, "Payment method updated successfully", 200, { paymentMethod });
  } catch (err) {
    return errorResponse(res, "Failed to update payment method", 500, err);
  }
};

const listPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.findAll();
    return successResponse(res, "Payment methods fetched successfully", 200, { paymentMethods });
  } catch (err) {
    return errorResponse(res, "Failed to fetch payment methods", 500, err);
  }
};

const togglePaymentMethodActive = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findByPk(id);

    if (!paymentMethod) {
      return errorResponse(res, "Payment method not found", 404);
    }

    paymentMethod.is_active = !paymentMethod.is_active;
    await paymentMethod.save();

    return successResponse(res, "Payment method status updated successfully", 200, { paymentMethod });
  } catch (err) {
    return errorResponse(res, "Failed to update payment method status", 500, err);
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findByPk(id);

    if (!paymentMethod) {
      return errorResponse(res, "Payment method not found", 404);
    }

    // Check if any firms are using this payment method
    const [firmsCount] = await sequelize.query(
      `SELECT COUNT(*) as count FROM firm_payment_methods WHERE payment_method_id = :paymentMethodId`,
      { replacements: { paymentMethodId: id }, type: sequelize.QueryTypes.SELECT }
    );

    if (parseInt(firmsCount.count) > 0) {
      return errorResponse(
        res,
        `Cannot delete payment method: It is associated with ${firmsCount.count} firm(s). Please remove associations first.`,
        400
      );
    }

    await paymentMethod.destroy();
    return successResponse(res, "Payment method deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete payment method", 500, err);
  }
};

module.exports = {
  createPaymentMethod,
  updatePaymentMethod,
  listPaymentMethods,
  togglePaymentMethodActive,
  deletePaymentMethod,
};


