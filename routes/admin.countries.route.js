const express = require("express");
const { listCountries, createCountry, updateCountry, deleteCountry } = require("../controllers/country.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { createCountrySchema, updateCountrySchema, countryIdParamSchema } = require("../validators/country.validator");

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN", "EDITOR"));

router.get("/", listCountries);
router.post("/", validateRequest({ body: createCountrySchema }), createCountry);
router.put("/:id", validateRequest({ params: countryIdParamSchema, body: updateCountrySchema }), updateCountry);
router.delete("/:id", validateRequest({ params: countryIdParamSchema }), deleteCountry);

module.exports = router;

