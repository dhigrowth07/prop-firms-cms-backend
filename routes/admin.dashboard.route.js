const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

/**
 * Dashboard Routes
 * Base URL: /api/v1/admin/dashboard
 */

// All routes here require at least basic authentication
router.use(authenticate);

// Get dashboard statistics
router.get("/stats", authorizeRoles("ADMIN", "EDITOR"), dashboardController.getDashboardStats);

module.exports = router;
