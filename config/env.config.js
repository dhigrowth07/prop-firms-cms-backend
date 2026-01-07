require("dotenv").config();
const checkMissingEnv = (requiredVars) => {
  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:");
    missingVars.forEach((key) => console.error(`- ${key}`));
    process.exit(1);
  }
};


const REQUIRED_ENV = [
  "PORT",
  "JWT_EXPIRATION",
  "JWT_SECRET",
  "APP_NAME",

  "CLIENT_URL",
  "NODE_ENV",
  "COLORED_LOG",
  "MORGAN_LOG_LEVEL",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "VERSION",

];

checkMissingEnv(REQUIRED_ENV);

module.exports = {
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  VERSION: process.env.VERSION,

  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
  COLORED_LOG: process.env.COLORED_LOG,
  MORGAN_LOG_LEVEL: process.env.MORGAN_LOG_LEVEL,
  JWT_SECRET: process.env.JWT_SECRET || "This-is-a-secret",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "7d",

  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,

};
