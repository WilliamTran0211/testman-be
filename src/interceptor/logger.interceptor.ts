import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import {
    WinstonLogger,
    SimpleLogFormatting
} from 'src/logger/winstonLogger.services';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    LoggerInstance = new WinstonLogger();

    intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { statusCode } = context.switchToHttp().getResponse();

        this.LoggerInstance.http(SimpleLogFormatting(request));
        console.log('hello');
        return next.handle().pipe(
            tap(data => {
                this.LoggerInstance.log({ statusCode, data });
            })
        );
    }
}
