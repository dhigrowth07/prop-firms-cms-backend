const express = require("express");
const {
  listPropConfig,
  listAssets,
  createAsset,
  updateAsset,
  toggleAssetActive,
  deleteAsset,
  listAccountTypes,
  createAccountType,
  updateAccountType,
  deleteAccountType,
  listEvaluationStages,
  createEvaluationStage,
  updateEvaluationStage,
  deleteEvaluationStage,
} = require("../controllers/prop.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createAssetSchema, updateAssetSchema, createAccountTypeSchema, updateAccountTypeSchema, createEvaluationStageSchema, updateEvaluationStageSchema } = require("../validators/prop.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

// Combined prop config
router.get("/", listPropConfig);

// Assets
router.get("/assets", listAssets);
router.post("/assets", validateRequest({ body: createAssetSchema }), createAsset);
router.put("/assets/:id", validateRequest({ body: updateAssetSchema }), updateAsset);
router.patch("/assets/:id/toggle-active", toggleAssetActive);
router.delete("/assets/:id", deleteAsset);

// Account types
router.get("/account-types", listAccountTypes);
router.post("/account-types", validateRequest({ body: createAccountTypeSchema }), createAccountType);
router.put("/account-types/:id", validateRequest({ body: updateAccountTypeSchema }), updateAccountType);
router.delete("/account-types/:id", deleteAccountType);

// Evaluation stages
router.get("/evaluation-stages", listEvaluationStages);
router.post("/evaluation-stages", validateRequest({ body: createEvaluationStageSchema }), createEvaluationStage);
router.put("/evaluation-stages/:id", validateRequest({ body: updateEvaluationStageSchema }), updateEvaluationStage);
router.delete("/evaluation-stages/:id", deleteEvaluationStage);

module.exports = router;
