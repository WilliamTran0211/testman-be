import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from 'src/filter/exception.filter';
import { ConfigModule } from '@nestjs/config';
import { envFilePath } from 'src/config/envFilePath';
import { WinstonLoggerModule } from 'src/logger/winstonLogger.module';
import { SampleModule } from './sample.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            ...envFilePath
        }),
        WinstonLoggerModule,
        SampleModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter
        }
    ]
})
export class AppModule {}
