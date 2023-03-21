import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import {
    SimpleLogFormatting,
    WinstonLogger
} from 'src/logger/winstonLogger.services';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { statusCode } = context.switchToHttp().getResponse();
        const LoggerInstance = WinstonLogger.getInstance();
        LoggerInstance.http(SimpleLogFormatting(request));
        return next.handle().pipe(
            tap(data => {
                LoggerInstance.log({ statusCode, data });
            })
        );
    }
}
