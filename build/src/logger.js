"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const { errors, combine, printf, timestamp } = winston_1.format;
const formatLog = printf(({ level, message, timestamp, stack }) => {
    const log = `${timestamp} ${level}: ${message}`;
    return stack ? `${log}\n${stack}` : log;
});
const transport = new winston_1.transports.DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
});
const logger = (0, winston_1.createLogger)({
    format: combine(errors({ stack: true }), timestamp(), formatLog),
    transports: [transport, new winston_1.transports.Console()],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map