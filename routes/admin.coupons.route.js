const express = require("express");
const { listCoupons, createCoupon, updateCoupon, toggleCouponActive, deleteCoupon } = require("../controllers/coupon.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createCouponSchema, updateCouponSchema, assignCouponToFirmSchema, assignCouponToAccountTypeSchema } = require("../validators/coupon.validator");
const { FirmCoupon, CouponAccountType } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

// Coupons
router.get("/", listCoupons);
router.post("/", validateRequest({ body: createCouponSchema }), createCoupon);
router.put("/:id", validateRequest({ body: updateCouponSchema }), updateCoupon);
router.patch("/:id/toggle-active", toggleCouponActive);
router.delete("/:id", deleteCoupon);

// Coupon assignments
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

module.exports = router;
