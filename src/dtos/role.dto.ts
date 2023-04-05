import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator';

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
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    permissions: Array<number>;
}

export class CreateRoleDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateRoleDTO {
    @IsNotEmpty()
    name?: string;
}

export class PermissionDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    resources: string;
}

export class UpdatePermissionDTO {
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsString()
    resources?: string;
}
