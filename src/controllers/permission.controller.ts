import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Res,
    ValidationPipe
} from '@nestjs/common';
import {
    Delete,
    Get,
    Param,
    Patch,
    Query,
    Req
} from '@nestjs/common/decorators';
import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common/exceptions';
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
import { GetPermissionsDTO, PermissionInputDTO } from 'src/dtos/permission.dto';
import { Permission } from 'src/entities/permission.entity';
import { PermissionsService } from 'src/services/permissions.service';

@ApiTags('Permission')
@Controller('permission')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}
    @Post()
    @ApiBody(swaggerRequest.inputPermission)
    @ApiCreatedResponse(swaggerResponse.createSuccess(String))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async create(
        @Req() request,
        @Res() response,
        @Body(new ValidationPipe({ transform: true }))
        body: PermissionInputDTO
    ) {
        const { name, resource, description } = body;
        const existedPermission =
            await this.permissionsService.getByNameAndResource({
                name,
                resource
            });
        if (existedPermission)
            throw new BadRequestException(errorMessage.EXISTED_PERMISSION);
        const result = await this.permissionsService.create({
            data: {
                name,
                resource,
                description,
                createdBy: request.user
            }
        });
        if (!result) {
            throw new InternalServerErrorException(errorMessage.SERVER_ERROR);
        }
        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.CREATED });
    }
    @Get()
    @ApiResponse(swaggerResponse.getSuccess(Permission))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async getPermissions(
        @Res() response,
        @Query(new ValidationPipe({ transform: true }))
        query: GetPermissionsDTO
    ) {
        const { statusFilter } = query;
        const filterOptions = customFilter([
            { field: 'status', value: statusFilter, isId: false }
        ]);
        const permissions = await this.permissionsService.getAll({
            filterOptions
        });
        return response.status(HttpStatus.OK).json({ info: permissions });
    }
    @Patch(':id')
    @ApiBody(swaggerRequest.inputPermission)
    @ApiResponse(swaggerResponse.getSuccess(Permission))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async update(
        @Req() request,
        @Res() response,
        @Param() { id }: FindOneParams,
        @Body(new ValidationPipe({ transform: true }))
        body: PermissionInputDTO
    ) {
        const { name, resource, description } = body;
        const existedPermission = await this.permissionsService.getById({ id });
        if (!existedPermission)
            throw new BadRequestException(errorMessage.NOT_FOUND_PERMISSION);
        const duplicatePermission =
            await this.permissionsService.getByNameAndResource({
                name,
                resource
            });

        if (duplicatePermission && duplicatePermission.id !== id)
            throw new BadRequestException(errorMessage.DUPLICATE_PERMISSION);

        const result = await this.permissionsService.update({
            id,
            data: {
                name,
                resource,
                description,
                updatedBy: request.user
            }
        });
        if (!result) {
            throw new InternalServerErrorException(errorMessage.SERVER_ERROR);
        }
        return response.status(HttpStatus.OK).json({ info: result });
    }
    @Delete(':id')
    @ApiResponse(swaggerResponse.getSuccess(String))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async delete(@Res() response, @Param() { id }: FindOneParams) {
        const deleteResponse = await this.permissionsService.softDelete({ id });
        if (!deleteResponse.affected) {
            throw new NotFoundException(errorMessage.NOT_FOUND_PERMISSION);
        }
        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.DELETED });
    }
}
