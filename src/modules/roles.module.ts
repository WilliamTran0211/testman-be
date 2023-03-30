import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { RolesService } from 'src/services/roles.service';
import { Permission } from 'src/entities/permission.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { RolesController } from 'src/controllers/role.controller';
import { PermissionsService } from 'src/services/permissions.service';
import { UsersModule } from './users.module';
import { UsersService } from 'src/services/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission]), UsersModule],
    exports: [TypeOrmModule],
    controllers: [RolesController],
    providers: [RolesService, UsersService, PermissionsService]
})
export class RolesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(RolesController);
    }
}
