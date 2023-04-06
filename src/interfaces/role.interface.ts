import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';

export interface RoleInterface {
    name: string;
    description: string;
    permissions: Permission[];
}
export interface CreateRoleInterface extends RoleInterface {
    createdBy: User;
    updatedBy?: User;
}

export interface UpdateRoleInterface extends RoleInterface {
    updatedBy: User;
}
