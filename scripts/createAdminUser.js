require("dotenv").config();

const { User, sequelize } = require("../config/connectDB");
const { hashPassword } = require("../utils/passwordUtils");
const logger = require("../utils/logger");

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to create an admin user.");
  process.exit(1);
}

(async () => {
  try {
    await sequelize.authenticate();

    let user = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (user) {
      logger.info(`Admin user already exists with email: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    const password_hash = await hashPassword(ADMIN_PASSWORD);

    user = await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password_hash,
      role: "ADMIN",
      is_active: true,
    });

    logger.info(`Admin user created with email: ${user.email}`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin user:", err);
    process.exit(1);
  }
})();
