import { Role } from 'src/entities/role.entity';

export interface CreateUserInterface {
    email: string;
    password: string;
    fullName: string;
    role: Role;
}
