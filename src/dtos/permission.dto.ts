import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RESOURCES, RIGHTS } from 'src/common/enums/permission.enum';
import { STATUS } from 'src/common/enums/status';

export class PermissionInputDTO {
    @IsNotEmpty()
    @IsEnum(RIGHTS)
    name: RIGHTS;

    @IsString()
    @IsOptional(null)
    description?: string;

    @IsNotEmpty()
    @IsEnum(RESOURCES)
    resource: RESOURCES;
}

export class UpdatePermissionDTO {
    @IsOptional(null)
    @IsEnum(RIGHTS)
    name?: RIGHTS;

    @IsString()
    @IsOptional(null)
    description?: string;

    @IsOptional(null)
    @IsEnum(RESOURCES)
    resource?: RESOURCES;
}

export class GetPermissionsDTO {
    @IsEnum(STATUS)
    @IsOptional(null)
    statusFilter?: STATUS;
}
