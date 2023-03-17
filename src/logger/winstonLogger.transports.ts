import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import {
    colors,
    AccessLogtransportDailyFileConfig,
    transportDailyFileConfig,
    transportHTTPConfig,
    transportsCommon,
    transportsConsoleConfig
} from './winstonLogger.config';

winston.addColors(colors);

const logFormatConsole = winston.format.combine(
    winston.format.label({ label: process.env.serviceName || 'name_app' }),
    winston.format.colorize({ all: true }),
    winston.format.timestamp({
        format: transportsCommon.formatDate
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(info => {
        return `${info.level}: ${info.message}`;
    })
);

export const transportsConsole = new winston.transports.Console({
    format: logFormatConsole,
    level: transportsConsoleConfig.level
});

export const HTTPtransportsConsole = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({
            format: transportsCommon.formatDate
        }),
        winston.format.errors({ stack: true }),
        winston.format.printf(info => {
            return `HTTP: ${info.message}`;
        })
    ),
    level: 'http'
});

const logFormatFile = winston.format.combine(
    winston.format.label({ label: process.env.serviceName || 'name_app' }),
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
        format: transportsCommon.formatDate
    }),

    winston.format.json({
        space: 0
    })
);

const ActionDailyRotateFile = {
    silent: transportDailyFileConfig.silent,
    filename: transportDailyFileConfig.filename,
    datePattern: transportDailyFileConfig.datePattern,
    zippedArchive: false,
    maxSize: transportDailyFileConfig.maxSize,
    maxFiles: transportDailyFileConfig.maxFiles,
    prepend: false,
    json: true
};
export const ActiontransportDailyFile = new DailyRotateFile(
    ActionDailyRotateFile
);

const AccessDailyRotateFile = {
    silent: AccessLogtransportDailyFileConfig.silent,
    filename: AccessLogtransportDailyFileConfig.filename,
    datePattern: AccessLogtransportDailyFileConfig.datePattern,
    zippedArchive: false,
    maxSize: AccessLogtransportDailyFileConfig.maxSize,
    maxFiles: AccessLogtransportDailyFileConfig.maxFiles,
    json: true
};
export const AccesstransportDailyFile = new DailyRotateFile(
    AccessDailyRotateFile
);

export const transportHttp = new winston.transports.Http({
    // phuong thuc POST
    format: logFormatFile,
    silent: transportHTTPConfig.silent,
    host: transportHTTPConfig.host,
    port: transportHTTPConfig.port,
    path: transportHTTPConfig.path
});

export const setConsoleTransportSilent = () => {
    HTTPtransportsConsole.silent = true;
    transportsConsole.silent = true;
};
