const express = require("express");
const { listCoupons, getCouponById, createCoupon, updateCoupon, toggleCouponActive, deleteCoupon } = require("../controllers/coupon.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createCouponSchema,
  updateCouponSchema,
  assignCouponToFirmSchema,
  assignCouponToAccountTypeSchema,
  unassignCouponFromFirmSchema,
  unassignCouponFromAccountTypeSchema,
} = require("../validators/coupon.validator");
const { FirmCoupon, CouponAccountType } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

// Coupons
router.get("/", listCoupons);
router.post("/", validateRequest({ body: createCouponSchema }), createCoupon);

// Coupon assignments (must come before /:id routes)
router.post("/assign/firm", validateRequest({ body: assignCouponToFirmSchema }), async (req, res) => {
  try {
    const relation = await FirmCoupon.create(req.body);
    return successResponse(res, "Coupon assigned to firm successfully", 201, { relation });
  } catch (err) {
    return errorResponse(res, "Failed to assign coupon to firm", 500, err);
  }
});

router.post("/assign/account-type", validateRequest({ body: assignCouponToAccountTypeSchema }), async (req, res) => {
  try {
    const relation = await CouponAccountType.create(req.body);
    return successResponse(res, "Coupon assigned to account type successfully", 201, { relation });
  } catch (err) {
    return errorResponse(res, "Failed to assign coupon to account type", 500, err);
  }
});

// Coupon unassignments
router.delete("/unassign/firm", validateRequest({ body: unassignCouponFromFirmSchema }), async (req, res) => {
  try {
    const { firm_id, coupon_id } = req.body;
    const deleted = await FirmCoupon.destroy({
      where: {
        firm_id,
        coupon_id,
      },
    });

    if (deleted === 0) {
      return errorResponse(res, "Coupon assignment not found", 404);
    }

    return successResponse(res, "Coupon unassigned from firm successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to unassign coupon from firm", 500, err);
  }
});

router.delete("/unassign/account-type", validateRequest({ body: unassignCouponFromAccountTypeSchema }), async (req, res) => {
  try {
    const { account_type_id, coupon_id } = req.body;
    const deleted = await CouponAccountType.destroy({
      where: {
        account_type_id,
        coupon_id,
      },
    });

    if (deleted === 0) {
      return errorResponse(res, "Coupon assignment not found", 404);
    }

    return successResponse(res, "Coupon unassigned from account type successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to unassign coupon from account type", 500, err);
  }
});

// Coupon CRUD by ID (must come after assignment routes)
router.get("/:id", getCouponById);
router.put("/:id", validateRequest({ body: updateCouponSchema }), updateCoupon);
router.patch("/:id/toggle-active", toggleCouponActive);
router.delete("/:id", deleteCoupon);

module.exports = router;
