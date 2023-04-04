import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestData } from 'src/entities/testData.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TestData])],
    exports: [TypeOrmModule],
    controllers: [],
    providers: []
})
export class TestDataModule {}
