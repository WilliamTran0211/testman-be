import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestStep } from 'src/entities/testStep.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TestStep])],
    exports: [TypeOrmModule],
    controllers: [],
    providers: []
})
export class TestStepsModule {}
