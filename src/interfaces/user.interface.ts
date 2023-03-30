import { Role } from 'src/entities/role.entity';

export interface CreateInterface {
    email: string;
    password: string;
    fullName: string;
    role: Role;
}
