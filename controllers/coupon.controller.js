const { Coupon, sequelize, Firm, AccountType } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      include: [
        {
          model: Firm,
          as: "firms",
          attributes: ["id"],
          through: { attributes: [] },
        },
        {
          model: AccountType,
          as: "account_types",
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return successResponse(res, "Coupons fetched successfully", 200, { coupons });
  } catch (err) {
    console.error("[listCoupons] Error:", err);
    return errorResponse(res, "Failed to fetch coupons", 500, err);
  }
};

const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const { Firm, AccountType, FirmCoupon, CouponAccountType } = require("../config/connectDB");

    const coupon = await Coupon.findByPk(id, {
      include: [
        {
          model: Firm,
          as: "firms",
          through: { attributes: [] },
          attributes: ["id", "name", "slug", "firm_type"],
          required: false,
        },
        {
          model: AccountType,
          as: "account_types",
          through: { attributes: [] },
          attributes: ["id", "name", "firm_id"],
          required: false,
          include: [
            {
              model: Firm,
              as: "firm",
              attributes: ["id", "name"],
              required: false,
            },
          ],
        },
      ],
    });

    if (!coupon) {
      return errorResponse(res, "Coupon not found", 404);
    }

    return successResponse(res, "Coupon fetched successfully", 200, { coupon });
  } catch (err) {
    return errorResponse(res, "Failed to fetch coupon", 500, err);
  }
};

const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    return successResponse(res, "Coupon created successfully", 201, { coupon });
  } catch (err) {
    return errorResponse(res, "Failed to create coupon", 500, err);
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return errorResponse(res, "Coupon not found", 404);
    }
    await coupon.update(req.body);
    return successResponse(res, "Coupon updated successfully", 200, { coupon });
  } catch (err) {
    return errorResponse(res, "Failed to update coupon", 500, err);
  }
};

const toggleCouponActive = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return errorResponse(res, "Coupon not found", 404);
    }

    coupon.is_active = !coupon.is_active;
    await coupon.save();

    return successResponse(res, "Coupon status updated successfully", 200, { coupon });
  } catch (err) {
    return errorResponse(res, "Failed to update coupon status", 500, err);
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);

    if (!coupon) {
      return errorResponse(res, "Coupon not found", 404);
    }

    // Check associations
    const [firmsCount] = await sequelize.query(`SELECT COUNT(*) as count FROM firm_coupons WHERE coupon_id = :couponId`, { replacements: { couponId: id }, type: sequelize.QueryTypes.SELECT });

    const [accountTypesCount] = await sequelize.query(`SELECT COUNT(*) as count FROM coupon_account_types WHERE coupon_id = :couponId`, {
      replacements: { couponId: id },
      type: sequelize.QueryTypes.SELECT,
    });

    const totalAssociations = parseInt(firmsCount.count) + parseInt(accountTypesCount.count);

    if (totalAssociations > 0) {
      return errorResponse(res, `Cannot delete coupon: It is associated with ${firmsCount.count} firm(s) and ${accountTypesCount.count} account type(s). Please remove associations first.`, 400);
    }

    await coupon.destroy();
    return successResponse(res, "Coupon deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete coupon", 500, err);
  }
};

module.exports = {
  listCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  toggleCouponActive,
  deleteCoupon,
};
