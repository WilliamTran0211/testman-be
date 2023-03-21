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
    json: true,
    handleExceptions: false
};

const AccessDailyRotateFile = {
    silent: AccessLogtransportDailyFileConfig.silent,
    filename: AccessLogtransportDailyFileConfig.filename,
    datePattern: AccessLogtransportDailyFileConfig.datePattern,
    zippedArchive: false,
    maxSize: AccessLogtransportDailyFileConfig.maxSize,
    maxFiles: AccessLogtransportDailyFileConfig.maxFiles,
    json: true,
    handleExceptions: false
};

export const transportHttp = new winston.transports.Http({
    // phuong thuc POST
    format: logFormatFile,
    silent: transportHTTPConfig.silent,
    host: transportHTTPConfig.host,
    port: transportHTTPConfig.port,
    path: transportHTTPConfig.path
});

export const setMaxListenersTranports = () => {
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
    winston.format.label({ label: process.env.serviceName || 'name_app' }),
    winston.format.timestamp({
        format: transportsCommon.formatDate
    }),
    winston.format.errors({ stack: true }),
    winston.format.json({
        space: 0 // khoảng trắng vào json, 0 là in ra liền giống JSON.stringtify, còn 2 trở lên là sẽ dễ đọc hơn
    })
);

export class TransportsConsoleLogger {
    // Singleton for transport
    private static consoleTransportIntance;
    private static httpConsoleTransportIntance;

    public static getConsoleTransportInstance() {
        if (!TransportsConsoleLogger.consoleTransportIntance) {
            TransportsConsoleLogger.consoleTransportIntance =
                new winston.transports.Console({
                    format: logFormatConsole,
                    level: transportsConsoleConfig.level,
                    handleExceptions: false
                });
        }
        return TransportsConsoleLogger.consoleTransportIntance;
    }

    public static getHTTPConsoleTransportInstance() {
        if (!TransportsConsoleLogger.httpConsoleTransportIntance) {
            TransportsConsoleLogger.httpConsoleTransportIntance =
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
        return TransportsConsoleLogger.httpConsoleTransportIntance;
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
