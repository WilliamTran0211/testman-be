import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';

export interface CreateRoleInterface {
    name: string;
    description: string;
    permissions: Permission[];
    createdBy: User;
    updatedBy?: User;
}
