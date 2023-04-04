import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { UsersService } from 'src/services/users.service';
import { PermissionsModule } from './permissions.module';
import { ProjectsModule } from './projects.module';
import { RolesModule } from './roles.module';
import { TestCasesModule } from './testCases.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ProjectsModule,
        PermissionsModule,
        TestCasesModule,
        RolesModule
    ],
    exports: [TypeOrmModule],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UsersController);
    }
}
