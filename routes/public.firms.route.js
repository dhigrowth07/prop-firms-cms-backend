const express = require("express");
const { listFirms, getFirmBySlug } = require("../controllers/publicFirm.controller");
const validateRequest = require("../middleware/validation.middleware");
const Joi = require("joi");

const router = express.Router();

// Query parameter validation for firm_type, sorting, and filtering
const firmTypeQuerySchema = Joi.object({
  firm_type: Joi.string().valid("prop_firm", "futures_firm").optional(),
  sort_by: Joi.string().valid("name", "rating", "review_count", "founded_year", "max_allocation", "created_at").optional(),
  order: Joi.string().valid("ASC", "DESC").default("ASC").optional(),
  filter: Joi.string().valid("top_rated", "most_reviewed", "newest").optional().description("Filter presets: top_rated, most_reviewed, newest"),
});

// Slug parameter validation
const slugParamSchema = Joi.object({
  slug: Joi.string().required(),
});

// Public routes (no authentication required)
router.get("/", validateRequest({ query: firmTypeQuerySchema }), listFirms);
router.get("/:slug", validateRequest({ params: slugParamSchema }), getFirmBySlug);

module.exports = router;
