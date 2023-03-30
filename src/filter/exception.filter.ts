import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';
import {
    QueryFailedError,
    EntityNotFoundError,
    TypeORMError,
    TransactionAlreadyStartedError,
    InsertValuesMissingError
} from 'typeorm';
import { WinstonLogger } from 'src/logger/winstonLogger.services';

let responseBody: any = { message: 'Internal server error' };
let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private logger: WinstonLogger) {}

    private static handleTypeORMException(exception: TypeORMError): any {
        let responseBody, statusCode;
        switch (exception.name) {
            case QueryFailedError.name:
                statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
                responseBody = {
                    message: (exception as QueryFailedError).message
                };
                break;
            case EntityNotFoundError.name:
                statusCode = HttpStatus.NOT_FOUND;
                responseBody = {
                    message: (exception as EntityNotFoundError).message
                };
                break;
            case TransactionAlreadyStartedError.name:
                statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                responseBody = {
                    message: (exception as TransactionAlreadyStartedError)
                        .message
                };
                break;
            case InsertValuesMissingError.name:
                statusCode = HttpStatus.BAD_REQUEST;
                responseBody = {
                    message: (exception as InsertValuesMissingError).message
                };
                break;
            default:
                statusCode = HttpStatus.BAD_REQUEST;
                responseBody = {
                    message: (exception as TypeORMError).message
                };
                break;
        }

        return { responseBody, statusCode };
    }

    private static handleResponse(
        response: Response,
        exception: HttpException | Error
    ): void {
        if (exception instanceof HttpException) {
            responseBody = exception.getResponse();
            statusCode = exception.getStatus();
        } else if (exception instanceof TypeORMError) {
            const ormExcep = this.handleTypeORMException(exception);
            responseBody = ormExcep.responseBody;
            statusCode = ormExcep.statusCode;
        } else if (exception instanceof Error) {
            responseBody = {
                name: exception.name,
                message: exception.message,
                detail: exception.stack
            };
        }
        response.status(statusCode).json(responseBody);
    }

    catch(exception: HttpException | Error, host: ArgumentsHost): void {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse();
        // Handling error message and logging
        this.loggingException(exception);
        // Response to client
        return AllExceptionFilter.handleResponse(response, exception);
    }

    private loggingException(exception: HttpException | Error): void {
        let message = 'Internal Server Error';
        if (exception instanceof HttpException) {
            message = JSON.stringify(exception.getResponse());
            this.logger.http(message);
        } else if (exception instanceof Error) {
            const detail = exception.stack.toString();
            message = exception.message.toString();
            this.logger.error(message, detail);
        }
    }
}
