import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { UsersService } from 'src/services/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [TypeOrmModule],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UsersController);
    }
}
