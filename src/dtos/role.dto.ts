import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator';
import { STATUS } from 'src/common/enums/status';

export class RoleInputDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsOptional(null)
    description?: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    permissions: Array<number>;
}
export class UpdateRoleInputDTO {
    @IsOptional(null)
    @IsString()
    name?: string;

    @IsString()
    @IsOptional(null)
    description?: string;

    @IsOptional(null)
    @IsArray()
    @ArrayMinSize(1)
    permissions?: Array<number>;
}

export class GetRolesDTO {
    @IsEnum(STATUS)
    @IsOptional(null)
    statusFilter?: STATUS;
}
