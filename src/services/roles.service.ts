import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { CreateInterface } from 'src/interfaces/role.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>
    ) {}

    async create({ data }: { data: CreateInterface }) {
        return this.rolesRepository.create(data);
    }
    async getById({ id }: { id: number }) {
        return this.rolesRepository.findOne({
            where: { id }
        });
    }
    async getByName({ name }: { name: string }) {
        return this.rolesRepository.findOne({
            where: { name }
        });
    }
}
