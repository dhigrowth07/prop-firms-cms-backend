const express = require("express");
const { createFirm, updateFirm, listFirms, getFirmById, toggleFirmActive, deleteFirm } = require("../controllers/firm.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createFirmSchema, updateFirmSchema, firmIdParamSchema } = require("../validators/firm.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

router.get("/", listFirms);
router.get("/:id", validateRequest({ params: firmIdParamSchema }), getFirmById);
router.post("/", validateRequest({ body: createFirmSchema }), createFirm);
router.put("/:id", validateRequest({ params: firmIdParamSchema, body: updateFirmSchema }), updateFirm);
router.patch("/:id/toggle-active", validateRequest({ params: firmIdParamSchema }), toggleFirmActive);
router.delete("/:id", validateRequest({ params: firmIdParamSchema }), deleteFirm);

module.exports = router;
