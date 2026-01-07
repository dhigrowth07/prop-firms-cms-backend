const express = require("express");
const { listCommissions, createCommission, updateCommission, deleteCommission } = require("../controllers/commission.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createCommissionSchema, updateCommissionSchema, commissionIdParamSchema } = require("../validators/commission.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

router.get("/", listCommissions);
router.post("/", validateRequest({ body: createCommissionSchema }), createCommission);
router.put("/:id", validateRequest({ params: commissionIdParamSchema, body: updateCommissionSchema }), updateCommission);
router.delete("/:id", validateRequest({ params: commissionIdParamSchema }), deleteCommission);

module.exports = router;

