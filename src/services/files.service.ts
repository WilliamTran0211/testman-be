import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(File)
        private filesRepository: Repository<File>
    ) {}
    async getById({ id }: { id: number }) {
        return await this.filesRepository.findOne({
            where: { id }
        });
    }
}
