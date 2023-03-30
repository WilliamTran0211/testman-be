import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    USER_FIELD,
    USER_FIELD_WITH_PASSWORD,
    USER_FIELD_WITH_REFRESH_TOKEN
} from 'src/common/enums/field';
import { STATUS } from 'src/common/enums/status';
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
    async getAll() {
        return await this.usersRepository.find({
            relations: {
                role: true
            }
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
