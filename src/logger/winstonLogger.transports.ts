import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import {
    colors,
    AccessLogTransportDailyFileConfig,
    transportDailyFileConfig,
    transportHTTPConfig,
    transportsCommon,
    transportsConsoleConfig
} from './winstonLogger.config';

winston.addColors(colors);

const logFormatConsole = winston.format.combine(
    winston.format.label({ label: process.env.SERVICE_NAME || 'name_app' }),
    winston.format.colorize({ all: true }),
    winston.format.timestamp({
        format: transportsCommon.formatDate
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(info => {
        return `${info.level}: ${info.message}`;
    })
);

const logFormatFile = winston.format.combine(
    winston.format.label({ label: process.env.SERVICE_NAME || 'name_app' }),
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
    json: true,
    handleExceptions: false
};

const AccessDailyRotateFile = {
    silent: AccessLogTransportDailyFileConfig.silent,
    filename: AccessLogTransportDailyFileConfig.filename,
    datePattern: AccessLogTransportDailyFileConfig.datePattern,
    zippedArchive: false,
    maxSize: AccessLogTransportDailyFileConfig.maxSize,
    maxFiles: AccessLogTransportDailyFileConfig.maxFiles,
    json: true,
    handleExceptions: false
};

export const transportHttp = new winston.transports.Http({
    // POST Method
    format: logFormatFile,
    silent: transportHTTPConfig.silent,
    host: transportHTTPConfig.host,
    port: transportHTTPConfig.port,
    path: transportHTTPConfig.path
});

export const setMaxListenersTransports = () => {
    TransportsConsoleLogger.getConsoleTransportInstance().setMaxListeners(
        Infinity
    );
    TransportsConsoleLogger.getHTTPConsoleTransportInstance().setMaxListeners(
        Infinity
    );
    TransportsDailyFileLog.getActionLogFileInstance().setMaxListeners(Infinity);
    TransportsDailyFileLog.getAccessLogFileInstance().setMaxListeners(Infinity);
};

export const setConsoleTransportSilent = () => {
    TransportsConsoleLogger.getHTTPConsoleTransportInstance().silent = true;
    TransportsConsoleLogger.getConsoleTransportInstance().silent = true;
};

export const logFormatDefault = winston.format.combine(
    winston.format.label({ label: process.env.SERVICE_NAME || 'name_app' }),
    winston.format.timestamp({
        format: transportsCommon.formatDate
    }),
    winston.format.errors({ stack: true }),
    winston.format.json({
        space: 0 // 0 is json stringify, 2 is easy to read
    })
);

export class TransportsConsoleLogger {
    // Singleton for transport
    private static consoleTransportInstance;
    private static httpConsoleTransportInstance;

    public static getConsoleTransportInstance() {
        if (!TransportsConsoleLogger.consoleTransportInstance) {
            TransportsConsoleLogger.consoleTransportInstance =
                new winston.transports.Console({
                    format: logFormatConsole,
                    level: transportsConsoleConfig.level,
                    handleExceptions: false
                });
        }
        return TransportsConsoleLogger.consoleTransportInstance;
    }

    public static getHTTPConsoleTransportInstance() {
        if (!TransportsConsoleLogger.httpConsoleTransportInstance) {
            TransportsConsoleLogger.httpConsoleTransportInstance =
                new winston.transports.Console({
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
                    level: 'http',
                    handleExceptions: false
                });
        }
        return TransportsConsoleLogger.httpConsoleTransportInstance;
    }
}

export class TransportsDailyFileLog {
    // Singleton for transport
    private static TransportActionLogFile;
    private static TransportAccessLogFile;

    public static getActionLogFileInstance(): DailyRotateFile {
        if (!TransportsDailyFileLog.TransportActionLogFile) {
            TransportsDailyFileLog.TransportActionLogFile = new DailyRotateFile(
                ActionDailyRotateFile
            );
        }
        return TransportsDailyFileLog.TransportActionLogFile;
    }

    public static getAccessLogFileInstance(): DailyRotateFile {
        if (!TransportsDailyFileLog.TransportAccessLogFile) {
            TransportsDailyFileLog.TransportAccessLogFile = new DailyRotateFile(
                AccessDailyRotateFile
            );
        }
        return TransportsDailyFileLog.TransportAccessLogFile;
    }
}
