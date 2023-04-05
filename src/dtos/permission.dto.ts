import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RESOURCES, RIGHTS } from 'src/common/enums/permission.enum';

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
