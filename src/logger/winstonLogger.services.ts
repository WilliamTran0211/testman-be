import * as winston from 'winston';
import { LoggerService, Injectable } from '@nestjs/common';
import {
    logFormatDefault,
    setConsoleTransportSilent,
    setMaxListenersTransports,
    TransportsConsoleLogger,
    TransportsDailyFileLog
} from './winstonLogger.transports';

const isTesting = () => process.env?.TEST_ENV == 'true';
const isProduction = () => process.env?.NODE_ENV?.trim() == 'production';

const isRunningTest = () => {
    if (isTesting()) {
        //set silent and Listeners for console logging
        TransportsConsoleLogger.getConsoleTransportInstance().silent = true;
        TransportsConsoleLogger.getHTTPConsoleTransportInstance().silent = true;

        //set silent and Listeners for transport logging file
        TransportsDailyFileLog.getAccessLogFileInstance().silent = true;
        TransportsDailyFileLog.getActionLogFileInstance().silent = true;

        setMaxListenersTransports();
    }
};

const WinstonLoggerCreated = (contextName: string, transports: any) => {
    const loggerInstance = winston.createLogger({
        defaultMeta: { service: contextName },
        format: logFormatDefault,
        transports: transports
    });

    return loggerInstance;
};

// https://github.com/winstonjs/winston
@Injectable()
export class WinstonLogger implements LoggerService {
    private static instance: WinstonLogger;
    private winston;
    private contextName;
    constructor() {
        isRunningTest();

        this.winston = WinstonLoggerCreated(this.contextName, [
            TransportsConsoleLogger.getConsoleTransportInstance(),
            TransportsDailyFileLog.getActionLogFileInstance()
        ]);

        setMaxListenersTransports();

        if (isProduction()) {
            setConsoleTransportSilent();
        }
    }

    public static getInstance(): WinstonLogger {
        // Singleton instance
        if (!WinstonLogger.instance) {
            WinstonLogger.instance = new WinstonLogger();
        }
        return WinstonLogger.instance;
    }

    addTransport(isHttp = false) {
        const myInstance = WinstonLogger.getInstance();

        if (isHttp) {
            myInstance.winston.add(
                TransportsConsoleLogger.getHTTPConsoleTransportInstance()
            );
            myInstance.winston.add(
                TransportsDailyFileLog.getAccessLogFileInstance()
            );
        } else {
            myInstance.winston.add(
                TransportsConsoleLogger.getConsoleTransportInstance()
            );
            myInstance.winston.add(
                TransportsDailyFileLog.getActionLogFileInstance()
            );
        }
    }

    setContextName(contextName) {
        this.contextName = contextName;
    }

    clear(clearTransportsName?: string) {
        console.log('Clear');
        this.winston.clear();

        if (!clearTransportsName) {
            console.log('adding');
            this.addTransport();
        } else if (clearTransportsName.toUpperCase() === 'HTTP') {
            console.log('adding HTTP');
            this.addTransport(true);
        }
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
        const httpWinstonLog = WinstonLoggerCreated(this.contextName, [
            TransportsConsoleLogger.getHTTPConsoleTransportInstance(),
            TransportsDailyFileLog.getAccessLogFileInstance()
        ]);

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

export const RequestFormatting = (request: any) => {
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

export const ResponseFormatting = (
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
        service_code: ''
    };
};
