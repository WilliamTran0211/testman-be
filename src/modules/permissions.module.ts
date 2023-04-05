import { forwardRef, Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from 'src/controllers/permission.controller';
import { Permission } from 'src/entities/permission.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { PermissionsService } from 'src/services/permissions.service';
import { UsersService } from 'src/services/users.service';
import { UsersModule } from './users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Permission]), UsersModule],
    exports: [TypeOrmModule],
    controllers: [PermissionsController],
    providers: [PermissionsService, UsersService]
})
export class PermissionsModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(PermissionsController);
    }
}
