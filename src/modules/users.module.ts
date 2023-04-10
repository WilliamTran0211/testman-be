import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { FilesService } from 'src/services/files.service';
import { RolesService } from 'src/services/roles.service';
import { UsersService } from 'src/services/users.service';
import { FilesModule } from './file.module';
import { RolesModule } from './roles.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), RolesModule, FilesModule],
    exports: [TypeOrmModule],
    controllers: [UsersController],
    providers: [UsersService, RolesService, FilesService]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UsersController);
    }
}
