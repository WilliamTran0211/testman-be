import { Module } from '@nestjs/common';
import { WinstonLogger as Logger } from './winstonLogger.services';

@Module({
    imports: [],
    controllers: [],
    providers: [Logger],
    exports: [Logger]
})
export class WinstonLoggerModule {}
