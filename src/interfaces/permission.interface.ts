import { User } from 'src/entities/user.entity';

export interface PermissionInterface {
    name: string;
    description: string;
    resource: string;
}

export interface CreatePermissionInterface extends PermissionInterface {
    createdBy: User;
    updatedBy?: User;
}

export interface UpdatePermissionInterface extends PermissionInterface {
    updatedBy: User;
}
