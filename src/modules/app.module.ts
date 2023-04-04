import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from 'src/filter/exception.filter';
import { WinstonLoggerModule } from 'src/logger/winstonLogger.module';
import { DatabaseModule } from './database.module';
import { UsersModule } from './users.module';
import { JWTCustomModule } from './jwt.module';
import { AuthModule } from './auth.module';
import { RolesModule } from './roles.module';
import { PermissionsModule } from './permissions.module';
import { TestCasesModule } from './testCases.module';

@Module({
    imports: [
        DatabaseModule,
        JWTCustomModule,
        WinstonLoggerModule,
        UsersModule,
        AuthModule,
        RolesModule,
        PermissionsModule,
        TestCasesModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter
        }
    ]
})
export class AppModule {}
