import { Module } from '@nestjs/common';
import { AppController } from '../controllers/sample.controller';
import { AppService } from '../services/sample.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService]
})
export class SampleModule {}
