import * as winston from 'winston';
import { LoggerService, Injectable } from '@nestjs/common';
import {
    AccesstransportDailyFile,
    ActiontransportDailyFile,
    HTTPtransportsConsole,
    transportsConsole,
    setConsoleTransportSilent
} from './winstonLogger.transports';
import { transportsCommon } from './winstonLogger.config';

const logFormatDefault = winston.format.combine(
    winston.format.label({ label: process.env.serviceName || 'name_app' }),
    winston.format.timestamp({
        format: transportsCommon.formatDate
    }),
    winston.format.errors({ stack: true }),
    winston.format.json({
        space: 0 // khoảng trắng vào json, 0 là in ra liền giống JSON.stringtify, còn 2 trở lên là sẽ dễ đọc hơn
    })
);

const isTesting = () => process.env?.TEST_ENV == 'true';
const isProduction = () => process.env?.NODE_ENV?.trim() == 'production';

const isRunningTest = () => {
    if (isTesting()) {
        //set slient and Listeners for console logging
        transportsConsole.silent = true;
        HTTPtransportsConsole.silent = true;
        transportsConsole.setMaxListeners(Infinity);
        HTTPtransportsConsole.setMaxListeners(Infinity);

        //set slient and Listeners for transport logging file
        AccesstransportDailyFile.silent = true;
        ActiontransportDailyFile.silent = true;
        AccesstransportDailyFile.setMaxListeners(Infinity);
        ActiontransportDailyFile.setMaxListeners(Infinity);
    }
};
// https://github.com/winstonjs/winston
@Injectable()
export class WinstonLogger implements LoggerService {
    private winston;
    private contextName;
    constructor() {
        isRunningTest();
        this.winston = winston.createLogger({
            format: logFormatDefault,
            defaultMeta: { service: this.contextName },
            transports: [transportsConsole, ActiontransportDailyFile]
        });

        if (isProduction()) {
            setConsoleTransportSilent();
        }
    }
    setContextName(contextName) {
        this.contextName = contextName;
    }

    clear() {
        this.winston.clear();
    }

    // 0
    error(message: any, key?: string) {
        this.winston.log({
            level: 'error',
            message,
            contextName: this.contextName,
            key
        });
    }

    //1
    warn(message: any, key?: string) {
        this.winston.log({
            level: 'warn',
            message,
            contextName: this.contextName,
            key
        });
    }

    // 2
    log(message: any, key?: string) {
        this.winston.log({
            level: 'info',
            message,
            contextName: this.contextName,
            key
        });
    }

    // 3
    http(message: any, key?: string) {
        const httpWinstonLog = winston.createLogger({
            format: logFormatDefault,
            defaultMeta: { service: this.contextName },
            transports: [HTTPtransportsConsole, AccesstransportDailyFile]
        });

        httpWinstonLog.log({
            level: 'info',
            message,
            contextName: this.contextName,
            key
        });
    }

    // 4
    verbose(message: any, key?: string) {
        this.winston.log({
            level: 'verbose',
            message,
            contextName: this.contextName,
            key
        });
    }

    // 5
    debug(message: any, key?: string) {
        this.winston.log({
            level: 'debug',
            message,
            contextName: this.contextName,
            key
        });
    }

    // 6
    silly(message: any, key?: string) {
        this.winston.log({
            level: 'silly',
            message,
            contextName: this.contextName,
            key
        });
    }
}

const getTimestamps = new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');

export const SimpleLogFormatting = (request: any) => {
    const url_destination =
        request.protocol + '://' + request.get('host') + request.originalUrl;

    const body = { ...request.body };

    if (
        body &&
        (body['password'] || body['passwordConfirm'] || body['oldPassword'])
    ) {
        delete body['password'];
        delete body['passwordConfirm'];
        delete body['oldPassword'];
    }

    return {
        url: url_destination,
        method: request.method,
        baseUrl: request.baseUrl,
        originalUrl: request.originalUrl,
        remoteAddress: request.ip,
        body: body || {},
        time: getTimestamps,
        header: request.headers || {
            'x-access-token': '',
            referer: '',
            'user-agent': '',
            accept: '',
            host: '',
            'accept-encoding': '',
            connection: ''
        }
    };
};

export const RequestFormating = (request: any) => {
    const fullUrl =
        request.protocol + '://' + request.get('host') + request.originalUrl;

    const body = { ...request.body };
    if (body['password'] || body['passwordConfirm'] || body['oldPassword']) {
        delete body['password'];
        delete body['passwordConfirm'];
        delete body['oldPassword'];
    }
    return {
        url: fullUrl || '',
        method: request.method,
        baseUrl: request.baseUrl,
        originalUrl: request.originalUrl,
        params: request.params || {},
        query: request.query || {},
        body: body || {},
        startTime: getTimestamps,
        remoteAddress: request.ip,
        'x-forwarded-for': request.headers['x-forwarded-for'] || request.ip,
        userID: request.userID || '',
        role: request.role || '',
        empId: request.empId || '',
        empEmail: request.empEmail || '',
        header: request.headers || {
            'x-access-token': '',
            referer: '',
            'user-agent': '',
            accept: '',
            host: '',
            'accept-encoding': '',
            connection: ''
        }
    };
};

export const ResponseFormating = (
    response: any,
    data: any,
    action_result: any
) => {
    const action_detail = { ...data };
    if (
        action_detail &&
        (action_detail['password'] ||
            action_detail['passwordConfirm'] ||
            action_detail['oldPassword'])
    ) {
        delete action_detail['password'];
        delete action_detail['passwordConfirm'];
        delete action_detail['oldPassword'];
    }
    return {
        evt_time: getTimestamps,
        src_ip: response.ip || null,
        component: response.router,
        action: response.method,
        action_detail: action_detail || {},
        action_result: action_result || undefined,
        req_url: response.originalUrl,
        req_domain: response.hostname,
        service_code: 'idt'
    };
};
