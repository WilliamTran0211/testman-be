import { STATUS } from 'src/common/enums/status';
import { User } from 'src/entities/user.entity';

export interface FileInterface {
    id?: number;
    type: string;
    url: string;
}

export interface CreateFileInterface {
    url: string;
    status?: STATUS;
    createdBy: User;
    updatedBy?: User;
}
