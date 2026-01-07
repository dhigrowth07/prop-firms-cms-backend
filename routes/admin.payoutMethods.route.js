const express = require("express");
const {
  createPayoutMethod,
  updatePayoutMethod,
  listPayoutMethods,
  togglePayoutMethodActive,
  deletePayoutMethod,
} = require("../controllers/payoutMethod.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createPayoutMethodSchema, updatePayoutMethodSchema } = require("../validators/payout.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

router.get("/", listPayoutMethods);
router.post("/", validateRequest({ body: createPayoutMethodSchema }), createPayoutMethod);
router.put("/:id", validateRequest({ body: updatePayoutMethodSchema }), updatePayoutMethod);
router.patch("/:id/toggle-active", togglePayoutMethodActive);
router.delete("/:id", deletePayoutMethod);

module.exports = router;


