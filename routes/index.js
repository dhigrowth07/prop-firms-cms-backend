const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const publicFirmsRoutes = require("./public.firms.route");
const adminFirmsRoutes = require("./admin.firms.route");
const adminPlatformsRoutes = require("./admin.platforms.route");
const adminBrokersRoutes = require("./admin.brokers.route");
const adminPayoutMethodsRoutes = require("./admin.payoutMethods.route");
const adminPaymentMethodsRoutes = require("./admin.paymentMethods.route");
const adminFuturesRoutes = require("./admin.futures.route");
const adminPropRoutes = require("./admin.prop.route");
const adminRulesRoutes = require("./admin.rules.route");
const adminCouponsRoutes = require("./admin.coupons.route");
const adminCountriesRoutes = require("./admin.countries.route");
const adminCommissionsRoutes = require("./admin.commissions.route");
const adminUsersRoutes = require("./admin.users.route");

// Public routes (no authentication required)
router.use("/firms", publicFirmsRoutes);

// Auth routes
router.use("/auth", authRoutes);

// Admin CMS routes
router.use("/admin/firms", adminFirmsRoutes);
router.use("/admin/platforms", adminPlatformsRoutes);
router.use("/admin/brokers", adminBrokersRoutes);
router.use("/admin/payout-methods", adminPayoutMethodsRoutes);
router.use("/admin/payment-methods", adminPaymentMethodsRoutes);
router.use("/admin/futures", adminFuturesRoutes);
router.use("/admin/prop", adminPropRoutes);
router.use("/admin", adminRulesRoutes);
router.use("/admin/coupons", adminCouponsRoutes);
router.use("/admin/countries", adminCountriesRoutes);
router.use("/admin/commissions", adminCommissionsRoutes);
router.use("/admin/users", adminUsersRoutes);

module.exports = router;
