import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RESOURCES, RIGHTS } from 'src/common/enums/permission.enum';
import { STATUS } from 'src/common/enums/status';
import { QueryOptions } from 'src/common/types/query.type';
import { Permission } from 'src/entities/permission.entity';
import {
    CreatePermissionInterface,
    UpdatePermissionInterface
} from 'src/interfaces/permission.interface';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private permissionsRepository: Repository<Permission>
    ) {}

    async create({ data }: { data: CreatePermissionInterface }) {
        return this.permissionsRepository.save(data);
    }
    async getAll(queryOptions: QueryOptions) {
        const { filterOptions } = queryOptions;
        return await this.permissionsRepository.find({
            where: { ...filterOptions }
        });
    }
    async getById({ id }: { id: number }) {
        return await this.permissionsRepository.findOne({
            where: { id }
        });
    }
    async getByIds({ ids }: { ids: number[] }) {
        return await this.permissionsRepository.find({
            where: { id: In(ids) }
        });
    }
    async getByName({ name }: { name: RIGHTS }) {
        return await this.permissionsRepository.findOne({
            where: { name }
        });
    }
    async getByNameAndResource({
        name,
        resource
    }: {
        name: RIGHTS;
        resource: RESOURCES;
    }) {
        return await this.permissionsRepository.findOne({
            where: { name, resource }
        });
    }
    async update({
        id,
        data
    }: {
        id: number;
        data: UpdatePermissionInterface;
    }) {
        await this.permissionsRepository.update(id, data);
        return await this.permissionsRepository.findOneBy({ id });
    }
    async softDelete({ id }: { id: number }) {
        return await this.permissionsRepository.update(
            { id, status: STATUS.ACTIVATE },
            {
                status: STATUS.DEACTIVATE
            }
        );
    }
}
