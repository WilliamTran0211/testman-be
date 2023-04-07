import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from 'src/controllers/file.controller';
import { File } from 'src/entities/file.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { PermissionsService } from 'src/services/permissions.service';
import { FilesService } from 'src/services/files.service';
import { UsersService } from 'src/services/users.service';
import { PermissionsModule } from './permissions.module';
import { UsersModule } from './users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
        forwardRef(() => UsersModule),
        PermissionsModule
    ],
    exports: [TypeOrmModule],
    controllers: [FilesController],
    providers: [FilesService, UsersService, PermissionsService]
})
export class FilesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(FilesController);
    }
}
