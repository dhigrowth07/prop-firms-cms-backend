const { Country, sequelize } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { QueryTypes } = require("sequelize");

const listCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      order: [["name", "ASC"]],
    });
    return successResponse(res, "Countries fetched successfully", 200, { countries });
  } catch (err) {
    return errorResponse(res, "Failed to fetch countries", 500, err);
  }
};

const createCountry = async (req, res) => {
  try {
    const country = await Country.create(req.body);
    return successResponse(res, "Country created successfully", 201, { country });
  } catch (err) {
    return errorResponse(res, "Failed to create country", 500, err);
  }
};

const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(id);
    if (!country) {
      return errorResponse(res, "Country not found", 404);
    }
    await country.update(req.body);
    return successResponse(res, "Country updated successfully", 200, { country });
  } catch (err) {
    return errorResponse(res, "Failed to update country", 500, err);
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(id);

    if (!country) {
      return errorResponse(res, "Country not found", 404);
    }

    // Check if any firms are using this country
    const [firmsCount] = await sequelize.query(`SELECT COUNT(*)::int as count FROM firm_restricted_countries WHERE country_id = :countryId`, {
      replacements: { countryId: id },
      type: QueryTypes.SELECT,
    });

    const firmsCountValue = Array.isArray(firmsCount) && firmsCount[0] && typeof firmsCount[0].count === "number" ? firmsCount[0].count : 0;

    if (firmsCountValue > 0) {
      return errorResponse(res, `Cannot delete country: It is associated with ${firmsCountValue} firm(s). Please remove associations first.`, 400);
    }

    await country.destroy();
    return successResponse(res, "Country deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete country", 500, err);
  }
};

module.exports = {
  listCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};

