import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS } from 'src/common/enums/status';
import { QueryOptions } from 'src/common/types/query.type';
import { Role } from 'src/entities/role.entity';
import {
    CreateRoleInterface,
    UpdateRoleInterface
} from 'src/interfaces/role.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>
    ) {}

    async create({ data }: { data: CreateRoleInterface }) {
        return await this.rolesRepository.save(data);
    }

    async getAll(queryOptions: QueryOptions) {
        const { filterOptions } = queryOptions;
        return await this.rolesRepository.find({
            where: { ...filterOptions }
        });
    }
    async getById({ id }: { id: number }) {
        return await this.rolesRepository.findOne({
            relations: { permissions: true },
            where: { id }
        });
    }
    async getByName({ name }: { name: string }) {
        return await this.rolesRepository.findOne({
            where: { name, status: STATUS.ACTIVATE }
        });
    }
    async updateWithManyToMany({ data }: { data: UpdateRoleInterface }) {
        return this.rolesRepository.save(data);
    }
    async softDelete({ id }: { id: number }) {
        return await this.rolesRepository.update(
            { id, status: STATUS.ACTIVATE },
            {
                status: STATUS.DEACTIVATE
            }
        );
    }
}
