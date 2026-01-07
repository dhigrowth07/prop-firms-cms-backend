const morgan = require("morgan");
const logger = require("../utils/logger");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const morganMiddleware = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens["response-time"](req, res);
  const contentLength = tokens.res(req, res, "content-length") || 0;
  const timestamp = moment().format("hh:mm:ss-A");

  const logMessage = `[${timestamp}] HTTP: ${method} ${url} ${status} ${responseTime} ms - ${contentLength}`;

  if (status >= 500) {
    logger.error(logMessage);
  } else if (status >= 400) {
    logger.warn(logMessage);
  } else {
    logger.http(logMessage);
  }

  return null;
});

module.exports = morganMiddleware;