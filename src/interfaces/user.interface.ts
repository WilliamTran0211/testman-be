import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';

export interface CreateUserInterface {
    email: string;
    password: string;
    fullName: string;
    role: Role;
    createBy?: User;
}
