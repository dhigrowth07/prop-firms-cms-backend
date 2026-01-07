const express = require("express");
const { createPlatform, updatePlatform, listPlatforms, togglePlatformActive, deletePlatform } = require("../controllers/platform.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createTradingPlatformSchema, updateTradingPlatformSchema } = require("../validators/platform.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

router.get("/", listPlatforms);
router.post("/", validateRequest({ body: createTradingPlatformSchema }), createPlatform);
router.put("/:id", validateRequest({ body: updateTradingPlatformSchema }), updatePlatform);
router.patch("/:id/toggle-active", togglePlatformActive);
router.delete("/:id", deletePlatform);

module.exports = router;


