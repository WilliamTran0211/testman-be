import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    USER_FIELD,
    USER_FIELD_WITH_PASSWORD,
    USER_FIELD_WITH_REFRESH_TOKEN
} from 'src/common/contants/fields.contants';
import { STATUS } from 'src/common/enums/status';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { CreateInterface } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async createUser({ data }: { data: CreateInterface }) {
        return this.usersRepository.save(data);
    }
    async getById({ id }: { id: number }) {
        return await this.usersRepository.findOne({
            relations: {
                role: true
            },
            where: { id },
            select: USER_FIELD
        });
    }

    async getByEmail({ email }: { email: string }) {
        return await this.usersRepository.findOne({
            where: { email },
            select: USER_FIELD
        });
    }

    async getByEmailWithPassword({ email }: { email: string }) {
        return await this.usersRepository.findOne({
            where: { email },
            select: USER_FIELD_WITH_PASSWORD
        });
    }
    async getByIdWithPassword({ id }: { id: number }) {
        return await this.usersRepository.findOne({
            where: { id },
            select: USER_FIELD_WITH_PASSWORD
        });
    }
    async getByIdWithRefreshToken({ id }: { id: number }) {
        return await this.usersRepository.findOne({
            where: { id, status: STATUS.ACTIVATE },
            select: USER_FIELD_WITH_REFRESH_TOKEN
        });
    }
    async getAll({
        searchOptions,
        filterOptions,
        relationOptions,
        selectOptions,
        paginationOptions
    }) {
        return await this.usersRepository.find({
            where: { ...searchOptions, ...filterOptions },
            relations: relationOptions,
            select: selectOptions,
            skip: paginationOptions.offset,
            take: paginationOptions.limit
        });
    }
    async updateRefreshToken({
        id,
        refreshToken
    }: {
        id: number;
        refreshToken: string;
    }) {
        return await this.usersRepository.update({ id }, { refreshToken });
    }
}
