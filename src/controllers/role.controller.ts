import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Req,
    Res,
    ValidationPipe
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { successMessage } from 'src/common/enums/successMessage';
import { swaggerRequest } from 'src/common/swagger/request.swagger';
import { swaggerResponse } from 'src/common/swagger/response.swagger';
import { RoleInputDTO } from 'src/dtos/role.dto';
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
}
