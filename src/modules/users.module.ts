import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { UsersService } from 'src/services/users.service';
import { RolesModule } from './roles.module';
import { RolesService } from 'src/services/roles.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RolesModule)],
    exports: [TypeOrmModule],
    controllers: [UsersController],
    providers: [UsersService, RolesService]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UsersController);
    }
}
