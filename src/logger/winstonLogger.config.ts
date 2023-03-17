// winston-custom-logger.config.ts

const actionLogDir = 'logs/action_log';
const accessLogDir = 'logs/access_log';

const dateFormat = {
    everyDay: 'YYYY-MM-DD',
    everyHour: 'YYYY-MM-DD-HH',
    everyMinute: 'YYYY-MM-DD-THH-mm'
};

const numberOfFilesToKeepLog = 30;
const fileSizeToRotate = '20m';

export const transportsCommon = {
    formatDate: 'YYYY-MM-DD,hh:mm:ss sssZ'
};

// config console
export const transportsConsoleConfig = {
    silent: true,
    level: 'info'
};

export const transportDailyFileConfig = {
    silent: false, // bật tắt logs
    filename: `${actionLogDir}/%DATE%.log`,
    datePattern: dateFormat.everyDay,
    maxSize: fileSizeToRotate,
    maxFiles: numberOfFilesToKeepLog,
    json: true
};

export const AccessLogtransportDailyFileConfig = {
    silent: false, // bật tắt logs
    filename: `${accessLogDir}/%DATE%.log`,
    datePattern: dateFormat.everyDay,
    maxSize: fileSizeToRotate,
    maxFiles: numberOfFilesToKeepLog,
    json: true
};

export const transportHTTPConfig = {
    silent: true,
    host: 'localhost',
    port: 8080,
    path: 'my-add-logs' // endpoint http
};

export const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

export const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'white'
};
