import { File } from 'src/entities/file.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';

export interface BaseUserInterface {
    fullName?: string;
    dayOfBirth?: Date;
    phoneNumber?: string;
    role?: Role;
    avatar?: File;
    password?: string;
}
export interface CreateUserInterface extends BaseUserInterface {
    email: string;
    password: string;
    role: Role;
    createBy?: User;
}
