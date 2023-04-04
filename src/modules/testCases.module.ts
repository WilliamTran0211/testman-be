import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from 'src/entities/testCase.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TestCase, User])],
    exports: [TypeOrmModule],
    controllers: [],
    providers: []
})
export class TestCasesModule {}
