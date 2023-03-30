import { Module, RequestMethod } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware/middleware-consumer.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/controllers/auth.controller';
import { User } from 'src/entities/user.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { RolesService } from 'src/services/roles.service';
import { UsersService } from 'src/services/users.service';
import { RolesModule } from './roles.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), RolesModule],
    exports: [TypeOrmModule],
    controllers: [AuthController],
    providers: [UsersService, RolesService]
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes({ path: '/auth/me', method: RequestMethod.GET });
    }
}
