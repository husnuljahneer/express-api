const winston = require("winston");

const filter = (level) =>
  winston.format((info) => {
    if (info.level === level) {
      return info;
    }
  })();

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  http: 5,
};

const transports = [
  new winston.transports.File({
    filename: "error.log",
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp(),

      winston.format.json()
    ),
  }),

  new winston.transports.File({
    filename: "combined.log",
    level: "info",

    format: winston.format.simple(),
  }),

  new winston.transports.File({
    filename: "http.log",
    level: "http",

    format: filter("http"),
  }),

  new winston.transports.Console({
    level: "debug",

    format: winston.format.combine(
      filter("debug"),

      winston.format.colorize(),

      winston.format.timestamp(),

      winston.format.simple()
    ),
  }),
];

const logger = winston.createLogger({
  levels,
  transports,
});

module.exports = logger;
