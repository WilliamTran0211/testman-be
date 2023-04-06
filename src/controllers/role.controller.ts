import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    ValidationPipe
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { successMessage } from 'src/common/enums/successMessage';
import { swaggerRequest } from 'src/common/swagger/request.swagger';
import { swaggerResponse } from 'src/common/swagger/response.swagger';
import { customFilter } from 'src/common/utils/helper/query.helper';
import FindOneParams from 'src/dtos/params.dto';
import {
    GetRolesDTO,
    RoleInputDTO,
    UpdateRoleInputDTO
} from 'src/dtos/role.dto';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { PermissionsService } from 'src/services/permissions.service';
import { RolesService } from 'src/services/roles.service';

@ApiTags('Role')
@Controller('role')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly permissionsService: PermissionsService
    ) {}
    @Post()
    @ApiBody(swaggerRequest.inputRole)
    @ApiCreatedResponse(swaggerResponse.createSuccess(String))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async create(
        @Req() request,
        @Res() response,
        @Body(new ValidationPipe({ transform: true }))
        body: RoleInputDTO
    ) {
        const { name, description, permissions } = body;
        const existedRole = await this.rolesService.getByName({ name });
        if (existedRole)
            throw new BadRequestException(errorMessage.EXISTED_ROLE);
        const permissionsInfo = await this.permissionsService.getByIds({
            ids: permissions
        });
        if (
            !permissionsInfo ||
            permissionsInfo.length === 0 ||
            permissionsInfo.length !== permissions.length
        ) {
            throw new BadRequestException(errorMessage.NOT_FOUND_PERMISSION);
        }
        const createdRole = await this.rolesService.create({
            data: {
                name,
                description,
                permissions: permissionsInfo,
                createdBy: request.user
            }
        });
        if (!createdRole)
            throw new InternalServerErrorException(errorMessage.SERVER_ERROR);

        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.CREATED });
    }
    @Get()
    @ApiResponse(swaggerResponse.getSuccess(Role))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async getPermissions(
        @Res() response,
        @Query(new ValidationPipe({ transform: true }))
        query: GetRolesDTO
    ) {
        const { statusFilter } = query;
        const filterOptions = customFilter([
            { field: 'status', value: statusFilter, isId: false }
        ]);
        const roles = await this.rolesService.getAll({
            filterOptions
        });
        return response.status(HttpStatus.OK).json({ info: roles });
    }
    @Get(':id')
    @ApiResponse(swaggerResponse.getSuccess(Role))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async getPermission(@Res() response, @Param() { id }: FindOneParams) {
        const role = await this.rolesService.getById({ id });
        if (!role) throw new BadRequestException(errorMessage.NOT_FOUND_ROLE);
        return response.status(HttpStatus.OK).json({ info: role });
    }
    @Patch(':id')
    @ApiBody(swaggerRequest.inputRole)
    @ApiResponse(swaggerResponse.getSuccess(Role))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async update(
        @Req() request,
        @Res() response,
        @Param() { id }: FindOneParams,
        @Body(new ValidationPipe({ transform: true }))
        body: UpdateRoleInputDTO
    ) {
        const { name, permissions, description } = body;
        const existedRole = await this.rolesService.getById({ id });
        if (!existedRole)
            throw new BadRequestException(errorMessage.NOT_FOUND_ROLE);
        const duplicateRole = await this.rolesService.getByName({
            name
        });
        if (duplicateRole && duplicateRole.id !== id)
            throw new BadRequestException(errorMessage.DUPLICATE_ROLE);
        let permissionsInfo: Permission[];
        if (permissions) {
            permissionsInfo = await this.permissionsService.getByIds({
                ids: permissions
            });
            if (
                !permissionsInfo ||
                permissionsInfo.length === 0 ||
                permissionsInfo.length !== permissions.length
            ) {
                throw new BadRequestException(
                    errorMessage.NOT_FOUND_PERMISSION
                );
            }
        }
        const updatedRole = await this.rolesService.updateWithManyToMany({
            data: {
                ...existedRole,
                name,
                description,
                permissions: permissionsInfo,
                updatedBy: request.user
            }
        });
        return response.status(HttpStatus.OK).json({ info: updatedRole });
    }
    @Delete(':id')
    @ApiResponse(swaggerResponse.getSuccess(String))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async delete(@Res() response, @Param() { id }: FindOneParams) {
        const deleteResponse = await this.rolesService.softDelete({ id });
        if (!deleteResponse.affected) {
            throw new BadRequestException(errorMessage.NOT_FOUND_PERMISSION);
        }
        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.DELETED });
    }
}
