const { InstrumentType, FuturesExchange, FuturesProgram, sequelize } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// Instrument Types
const listInstrumentTypes = async (req, res) => {
  try {
    const instrumentTypes = await InstrumentType.findAll();
    return successResponse(res, "Instrument types fetched successfully", 200, { instrumentTypes });
  } catch (err) {
    return errorResponse(res, "Failed to fetch instrument types", 500, err);
  }
};

const createInstrumentType = async (req, res) => {
  try {
    const instrumentType = await InstrumentType.create(req.body);
    return successResponse(res, "Instrument type created successfully", 201, { instrumentType });
  } catch (err) {
    return errorResponse(res, "Failed to create instrument type", 500, err);
  }
};

const updateInstrumentType = async (req, res) => {
  try {
    const { id } = req.params;
    const instrumentType = await InstrumentType.findByPk(id);
    if (!instrumentType) {
      return errorResponse(res, "Instrument type not found", 404);
    }
    await instrumentType.update(req.body);
    return successResponse(res, "Instrument type updated successfully", 200, { instrumentType });
  } catch (err) {
    return errorResponse(res, "Failed to update instrument type", 500, err);
  }
};

// Futures Exchanges
const listFuturesExchanges = async (req, res) => {
  try {
    const futuresExchanges = await FuturesExchange.findAll();
    return successResponse(res, "Futures exchanges fetched successfully", 200, { futuresExchanges });
  } catch (err) {
    return errorResponse(res, "Failed to fetch futures exchanges", 500, err);
  }
};

const createFuturesExchange = async (req, res) => {
  try {
    const futuresExchange = await FuturesExchange.create(req.body);
    return successResponse(res, "Futures exchange created successfully", 201, { futuresExchange });
  } catch (err) {
    return errorResponse(res, "Failed to create futures exchange", 500, err);
  }
};

const updateFuturesExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const futuresExchange = await FuturesExchange.findByPk(id);
    if (!futuresExchange) {
      return errorResponse(res, "Futures exchange not found", 404);
    }
    await futuresExchange.update(req.body);
    return successResponse(res, "Futures exchange updated successfully", 200, { futuresExchange });
  } catch (err) {
    return errorResponse(res, "Failed to update futures exchange", 500, err);
  }
};

// Futures Programs
const listFuturesPrograms = async (req, res) => {
  try {
    const futuresPrograms = await FuturesProgram.findAll();
    return successResponse(res, "Futures programs fetched successfully", 200, { futuresPrograms });
  } catch (err) {
    return errorResponse(res, "Failed to fetch futures programs", 500, err);
  }
};

const createFuturesProgram = async (req, res) => {
  try {
    const futuresProgram = await FuturesProgram.create(req.body);
    return successResponse(res, "Futures program created successfully", 201, { futuresProgram });
  } catch (err) {
    return errorResponse(res, "Failed to create futures program", 500, err);
  }
};

const updateFuturesProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const futuresProgram = await FuturesProgram.findByPk(id);
    if (!futuresProgram) {
      return errorResponse(res, "Futures program not found", 404);
    }
    await futuresProgram.update(req.body);
    return successResponse(res, "Futures program updated successfully", 200, { futuresProgram });
  } catch (err) {
    return errorResponse(res, "Failed to update futures program", 500, err);
  }
};

const deleteInstrumentType = async (req, res) => {
  try {
    const { id } = req.params;
    const instrumentType = await InstrumentType.findByPk(id);

    if (!instrumentType) {
      return errorResponse(res, "Instrument type not found", 404);
    }

    // InstrumentType has no associations, safe to delete
    await instrumentType.destroy();
    return successResponse(res, "Instrument type deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete instrument type", 500, err);
  }
};

const deleteFuturesExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const futuresExchange = await FuturesExchange.findByPk(id);

    if (!futuresExchange) {
      return errorResponse(res, "Futures exchange not found", 404);
    }

    // Check if any firms are using this exchange
    const [firmsCount] = await sequelize.query(`SELECT COUNT(*) as count FROM firm_futures_exchanges WHERE futures_exchange_id = :exchangeId`, {
      replacements: { exchangeId: id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (parseInt(firmsCount.count) > 0) {
      return errorResponse(res, `Cannot delete futures exchange: It is associated with ${firmsCount.count} firm(s). Please remove associations first.`, 400);
    }

    await futuresExchange.destroy();
    return successResponse(res, "Futures exchange deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete futures exchange", 500, err);
  }
};

const deleteFuturesProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const futuresProgram = await FuturesProgram.findByPk(id);

    if (!futuresProgram) {
      return errorResponse(res, "Futures program not found", 404);
    }

    // FuturesProgram belongs to Firm, but can be deleted directly (cascade handled)
    await futuresProgram.destroy();
    return successResponse(res, "Futures program deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete futures program", 500, err);
  }
};

module.exports = {
  listInstrumentTypes,
  createInstrumentType,
  updateInstrumentType,
  listFuturesExchanges,
  createFuturesExchange,
  updateFuturesExchange,
  listFuturesPrograms,
  createFuturesProgram,
  updateFuturesProgram,
  deleteInstrumentType,
  deleteFuturesExchange,
  deleteFuturesProgram,
};
