const express = require("express");
const { listRules, createRule, updateRule, deleteRule, listPayoutPolicies, createPayoutPolicy, updatePayoutPolicy, deletePayoutPolicy } = require("../controllers/rules.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createRuleSchema, updateRuleSchema, createPayoutPolicySchema, updatePayoutPolicySchema } = require("../validators/rules.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

// Rules
router.get("/rules", listRules);
router.post("/rules", validateRequest({ body: createRuleSchema }), createRule);
router.put("/rules/:id", validateRequest({ body: updateRuleSchema }), updateRule);
router.delete("/rules/:id", deleteRule);

// Payout policies
router.get("/payout-policies", listPayoutPolicies);
router.post("/payout-policies", validateRequest({ body: createPayoutPolicySchema }), createPayoutPolicy);
router.put("/payout-policies/:id", validateRequest({ body: updatePayoutPolicySchema }), updatePayoutPolicy);
router.delete("/payout-policies/:id", deletePayoutPolicy);

module.exports = router;
