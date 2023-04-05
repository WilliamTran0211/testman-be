import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Res,
    ValidationPipe
} from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import {
    BadRequestException,
    InternalServerErrorException
} from '@nestjs/common/exceptions';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiTags
} from '@nestjs/swagger';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { successMessage } from 'src/common/enums/successMessage';
import { swaggerRequest } from 'src/common/swagger/request.swagger';
import { swaggerResponse } from 'src/common/swagger/response.swagger';
import { PermissionInputDTO } from 'src/dtos/permission.dto';
import { User } from 'src/entities/user.entity';
import { PermissionsService } from 'src/services/permissions.service';

@ApiTags('Permission')
@Controller('permission')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}
    @Post()
    @ApiBody(swaggerRequest.inputPermission)
    @ApiCreatedResponse(swaggerResponse.createSuccess(String))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async signup(
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
}
