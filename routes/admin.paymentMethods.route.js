const express = require("express");
const { createPaymentMethod, updatePaymentMethod, listPaymentMethods, togglePaymentMethodActive, deletePaymentMethod } = require("../controllers/paymentMethod.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createPaymentMethodSchema, updatePaymentMethodSchema } = require("../validators/payment.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

router.get("/", listPaymentMethods);
router.post("/", validateRequest({ body: createPaymentMethodSchema }), createPaymentMethod);
router.put("/:id", validateRequest({ body: updatePaymentMethodSchema }), updatePaymentMethod);
router.patch("/:id/toggle-active", togglePaymentMethodActive);
router.delete("/:id", deletePaymentMethod);

module.exports = router;
