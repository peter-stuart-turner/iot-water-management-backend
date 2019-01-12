//  Logger constants
const winston = require('winston');
require('winston-daily-rotate-file');

var transport = new(winston.transports.DailyRotateFile)({
  filename: './log',
  datePattern: 'winston/yyyy-MM-dd.',
  prepend: true,
  level: process.env.ENV === 'development' ? 'debug' : 'info'
});

global.LOGGER = new(winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    transport
  ]
});
