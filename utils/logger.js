const colors = require("colors");
const winston = require("winston");
const moment = require("moment-timezone");
const { NODE_ENV, COLORED_LOG } = require("../config/env.config");
const { combine, timestamp, printf } = winston.format;
moment.tz.setDefault("Asia/Kolkata");

if (COLORED_LOG?.toLowerCase() === "true") {
  colors.enable();
} else {
  colors.disable();
}

const logFormat = printf(({ level, message }) => {
  const colorMap = {
    info: colors.green,
    warn: colors.yellow,
    error: colors.red,
    debug: colors.blue,
    http: colors.magenta,
  };

  const timestamp = moment().format("h:mm:ss-A");

  return `${colors.cyan(`[${timestamp}]`)} ${colorMap[level](level.toUpperCase())}: ${message}`;
});

const logger = winston.createLogger({
  level: NODE_ENV === "development" ? "debug" : "info",
  transports: [
    new winston.transports.Console({
      format: combine(logFormat),
    }),
    ...(NODE_ENV === "production"
      ? [
          // Error log file
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: combine(timestamp(), winston.format.json()),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          // Combined log file (all logs)
          new winston.transports.File({
            filename: "logs/combined.log",
            format: combine(timestamp(), winston.format.json()),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ]
      : []),
  ],
});

module.exports = logger;
