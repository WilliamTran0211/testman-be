import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from 'src/entities/testCase.entity';
import { UsersModule } from './users.module';
import { ProjectsModule } from './projects.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TestCase]),
        forwardRef(() => UsersModule),
        ProjectsModule
    ],
    exports: [TypeOrmModule],
    controllers: [],
    providers: []
})
export class TestCasesModule {}
