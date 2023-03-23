import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from 'src/filter/exception.filter';
import { ConfigModule } from '@nestjs/config';
import { envFilePath } from 'src/config/envFilePath';
import { WinstonLoggerModule } from 'src/logger/winstonLogger.module';
import { SampleModule } from './sample.module';
import { PrismaService } from 'src/services/prisma.service';
import { UserModule } from './user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            ...envFilePath
        }),
        WinstonLoggerModule,
        SampleModule,
        UserModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter
        },
        PrismaService
    ]
})
export class AppModule {}
