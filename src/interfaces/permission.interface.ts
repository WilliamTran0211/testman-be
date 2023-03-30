import { User } from 'src/entities/user.entity';

export interface CreateInterface {
    name: string;
    description: string;
    resource: string;
    createdBy: User;
    updatedBy: User;
}
