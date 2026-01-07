const express = require("express");
const { createBroker, updateBroker, listBrokers, toggleBrokerActive, deleteBroker } = require("../controllers/broker.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createBrokerSchema, updateBrokerSchema } = require("../validators/broker.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

router.get("/", listBrokers);
router.post("/", validateRequest({ body: createBrokerSchema }), createBroker);
router.put("/:id", validateRequest({ body: updateBrokerSchema }), updateBroker);
router.patch("/:id/toggle-active", toggleBrokerActive);
router.delete("/:id", deleteBroker);

module.exports = router;


