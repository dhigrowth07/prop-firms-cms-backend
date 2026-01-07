const { Broker, sequelize } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createBroker = async (req, res) => {
  try {
    const broker = await Broker.create(req.body);
    return successResponse(res, "Broker created successfully", 201, { broker });
  } catch (err) {
    return errorResponse(res, "Failed to create broker", 500, err);
  }
};

const updateBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const broker = await Broker.findByPk(id);

    if (!broker) {
      return errorResponse(res, "Broker not found", 404);
    }

    await broker.update(req.body);
    return successResponse(res, "Broker updated successfully", 200, { broker });
  } catch (err) {
    return errorResponse(res, "Failed to update broker", 500, err);
  }
};

const listBrokers = async (req, res) => {
  try {
    const brokers = await Broker.findAll();
    return successResponse(res, "Brokers fetched successfully", 200, { brokers });
  } catch (err) {
    return errorResponse(res, "Failed to fetch brokers", 500, err);
  }
};

const toggleBrokerActive = async (req, res) => {
  try {
    const { id } = req.params;
    const broker = await Broker.findByPk(id);

    if (!broker) {
      return errorResponse(res, "Broker not found", 404);
    }

    broker.is_active = !broker.is_active;
    await broker.save();

    return successResponse(res, "Broker status updated successfully", 200, { broker });
  } catch (err) {
    return errorResponse(res, "Failed to update broker status", 500, err);
  }
};

const deleteBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const broker = await Broker.findByPk(id);

    if (!broker) {
      return errorResponse(res, "Broker not found", 404);
    }

    // Check if any firms are using this broker
    const [firmsCount] = await sequelize.query(
      `SELECT COUNT(*) as count FROM firm_brokers WHERE broker_id = :brokerId`,
      { replacements: { brokerId: id }, type: sequelize.QueryTypes.SELECT }
    );

    if (parseInt(firmsCount.count) > 0) {
      return errorResponse(
        res,
        `Cannot delete broker: It is associated with ${firmsCount.count} firm(s). Please remove associations first.`,
        400
      );
    }

    await broker.destroy();
    return successResponse(res, "Broker deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete broker", 500, err);
  }
};

module.exports = {
  createBroker,
  updateBroker,
  listBrokers,
  toggleBrokerActive,
  deleteBroker,
};
