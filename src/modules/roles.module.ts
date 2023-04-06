import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from 'src/controllers/role.controller';
import { Role } from 'src/entities/role.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { PermissionsService } from 'src/services/permissions.service';
import { RolesService } from 'src/services/roles.service';
import { UsersService } from 'src/services/users.service';
import { PermissionsModule } from './permissions.module';
import { UsersModule } from './users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role]),
        forwardRef(() => UsersModule),
        PermissionsModule
    ],
    exports: [TypeOrmModule],
    controllers: [RolesController],
    providers: [RolesService, UsersService, PermissionsService]
})
export class RolesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(RolesController);
    }
}
