const { sequelize, syncModel } = require("../config/connectDB");

require("dotenv").config();

(async () => {
  await sequelize.authenticate();
  // await syncModel(["ModelName"], { alter: true });
  await sequelize.close();
})();
