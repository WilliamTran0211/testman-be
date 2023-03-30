import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { CreateInterface } from 'src/interfaces/permission.interface';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private permissionsRepository: Repository<Permission>
    ) {}

    async create({ data }: { data: CreateInterface }) {
        return this.permissionsRepository.create(data);
    }
    async getAll() {
        return this.permissionsRepository.find();
    }
    async getById({ id }: { id: number }) {
        return this.permissionsRepository.findOne({
            where: { id }
        });
    }
    async getByIds({ ids }: { ids: number[] }) {
        return this.permissionsRepository.find({
            where: { id: In(ids) }
        });
    }
    async getByName({ name }: { name: string }) {
        return this.permissionsRepository.findOne({
            where: { name }
        });
    }
}
