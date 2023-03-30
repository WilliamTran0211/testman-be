import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';

export interface CreateInterface {
    name: string;
    description: string;
    permissions: Permission[];
    createdBy: User;
    updatedBy?: User;
}
