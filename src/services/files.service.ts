import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileStorageDatabase } from 'src/common/enums/file.enum';
import { STATUS } from 'src/common/enums/status';
import { File } from 'src/entities/file.entity';
import { CreateFileInterface } from 'src/interfaces/file.interface';
import {
    DeleteResult,
    In,
    InsertResult,
    Repository,
    UpdateResult
} from 'typeorm';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(File)
        private filesRepository: Repository<File>
    ) {}

    async createFiles({
        values
    }: {
        values: CreateFileInterface[];
    }): Promise<InsertResult> {
        return await this.filesRepository
            .createQueryBuilder()
            .insert()
            .into(File)
            .values(values)
            .execute();
    }

    async getById({ id }: { id: number }): Promise<File> {
        return this.filesRepository.findOne({
            where: { id, status: STATUS.ACTIVATE }
        });
    }

    async getByIdAndType({
        id,
        type
    }: {
        id: number;
        type: object;
    }): Promise<File> {
        return this.filesRepository.findOne({
            where: { id, ...type, status: STATUS.ACTIVATE }
        });
    }

    async deactivateFile(id: number): Promise<UpdateResult> {
        return await this.filesRepository.update(id, {
            status: STATUS.DEACTIVATE
        });
    }

    async activateFile(id: number): Promise<UpdateResult> {
        return await this.filesRepository.update(id, {
            status: STATUS.ACTIVATE
        });
    }

    async deleteFile(id: number): Promise<DeleteResult> {
        return await this.filesRepository.delete(id);
    }

    async getFiles(ids: number[]): Promise<File[]> {
        return this.filesRepository.findBy({ id: In(ids) });
    }
}
