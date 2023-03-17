import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';
import { errorMessage } from 'src/common/enums/errorMessage';
import { WinstonLogger } from 'src/logger/winstonLogger.services';

let responseBody: any = { message: 'Internal server error' };
let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private logger: WinstonLogger) {}

    private static handleResponse(
        response: Response,
        exception: HttpException | Error
    ): void {
        if (exception instanceof HttpException) {
            responseBody = exception.getResponse();
            statusCode = exception.getStatus();
        } else if (exception instanceof Error) {
            if (exception.name == 'BSONTypeError') {
                responseBody = {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: errorMessage.ID_INVALID,
                    error: errorMessage.ID_INVALID
                };
                statusCode = HttpStatus.BAD_REQUEST;
            } else {
                responseBody = {
                    name: exception.name,
                    message: exception.message,
                    detail: exception.stack
                };
            }
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
