import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { State } from 'src/entities/state.entity';
import { TestCase } from 'src/entities/testCase.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([State, User, TestCase, Project])],
    exports: [TypeOrmModule],
    controllers: [],
    providers: []
})
export class StatesModule {}
