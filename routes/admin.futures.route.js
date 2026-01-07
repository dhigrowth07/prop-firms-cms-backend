const express = require("express");
const {
  listInstrumentTypes,
  createInstrumentType,
  updateInstrumentType,
  deleteInstrumentType,
  listFuturesExchanges,
  createFuturesExchange,
  updateFuturesExchange,
  deleteFuturesExchange,
  listFuturesPrograms,
  createFuturesProgram,
  updateFuturesProgram,
  deleteFuturesProgram,
} = require("../controllers/futures.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createInstrumentTypeSchema,
  updateInstrumentTypeSchema,
  createFuturesExchangeSchema,
  updateFuturesExchangeSchema,
  createFuturesProgramSchema,
  updateFuturesProgramSchema,
} = require("../validators/futures.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

// Instrument types
router.get("/instrument-types", listInstrumentTypes);
router.post("/instrument-types", validateRequest({ body: createInstrumentTypeSchema }), createInstrumentType);
router.put("/instrument-types/:id", validateRequest({ body: updateInstrumentTypeSchema }), updateInstrumentType);
router.delete("/instrument-types/:id", deleteInstrumentType);

// Futures exchanges
router.get("/exchanges", listFuturesExchanges);
router.post("/exchanges", validateRequest({ body: createFuturesExchangeSchema }), createFuturesExchange);
router.put("/exchanges/:id", validateRequest({ body: updateFuturesExchangeSchema }), updateFuturesExchange);
router.delete("/exchanges/:id", deleteFuturesExchange);

// Futures programs
router.get("/programs", listFuturesPrograms);
router.post("/programs", validateRequest({ body: createFuturesProgramSchema }), createFuturesProgram);
router.put("/programs/:id", validateRequest({ body: updateFuturesProgramSchema }), updateFuturesProgram);
router.delete("/programs/:id", deleteFuturesProgram);

module.exports = router;
