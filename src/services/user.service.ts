import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async user() {
        return this.prisma.user.findMany();
    }
    async create() {
        return {};
    }
}
