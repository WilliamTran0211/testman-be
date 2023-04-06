import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
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
import * as bcrypt from 'bcrypt';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { jwtConstants } from 'src/common/enums/jwtConstants';
import { ROLE } from 'src/common/enums/roles';
import { successMessage } from 'src/common/enums/successMessage';
import { swaggerRequest } from 'src/common/swagger/request.swagger';
import { swaggerResponse } from 'src/common/swagger/response.swagger';
import {
    customFilter,
    customSelectedFields,
    customSort,
    pagination,
    search
} from 'src/common/utils/helper/query.helper';
import { CreateUserDTO, GetUserQueryDTO } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { RolesService } from 'src/services/roles.service';
import { UsersService } from 'src/services/users.service';

@ApiTags('User')
@Controller('users')
@ApiResponse(swaggerResponse.getSuccess(User))
@ApiBadRequestResponse(swaggerResponse.badRequest())
@ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
@ApiInternalServerErrorResponse(swaggerResponse.serverError())
@Injectable()
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly rolesService: RolesService
    ) {}
    @Post()
    @ApiBody(swaggerRequest.inputCreateUser)
    @ApiCreatedResponse(swaggerResponse.createSuccess(String))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async create(
        @Req() request,
        @Res() response,
        @Body(new ValidationPipe({ transform: true }))
        body: CreateUserDTO
    ) {
        const { email, fullName, roleId, password } = body;
        const existedUser = await this.userService.getByEmail({ email });
        if (existedUser)
            throw new BadRequestException(errorMessage.EXISTED_USER);
        const hashedPassword = await bcrypt.hash(
            password,
            jwtConstants.HASH_ROUND
        );
        let roleInfo = await this.rolesService.getByName({
            name: ROLE.USER
        });
        if (roleId) {
            roleInfo = await this.rolesService.getById({ id: roleId });
            if (!roleInfo)
                throw new BadRequestException(errorMessage.NOT_FOUND_ROLE);
        }
        const result = await this.userService.createUser({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role: roleInfo,
                createBy: request.user
            }
        });
        if (!result)
            throw new InternalServerErrorException(errorMessage.SERVER_ERROR);
        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.CREATED });
    }
    @Get()
    async getUsers(
        @Res() response,
        @Query(new ValidationPipe({ transform: true }))
        query: GetUserQueryDTO
    ) {
        const {
            searchKey,
            projectFilter,
            roleFilter,
            searchFields,
            selectedFields,
            statusFilter,
            testCaseFilter,
            offset,
            limit,
            sort,
            order
        } = query;
        const searchOptions = search({ searchFields, searchKey });
        const sortOptions = customSort({ sort, order });
        const filterOptions = customFilter([
            { field: 'role', value: roleFilter, isId: true },
            { field: 'project', value: projectFilter, isId: true },
            { field: 'testCase', value: testCaseFilter, isId: true },
            { field: 'status', value: statusFilter, isId: false }
        ]);
        const { selectOptions, relationOptions } =
            customSelectedFields(selectedFields);
        const paginationOptions = pagination({ limit, offset });
        const users = await this.userService.getAll({
            searchOptions,
            filterOptions,
            relationOptions,
            selectOptions,
            sortOptions,
            paginationOptions
        });
        return response.status(HttpStatus.OK).json({ info: users });
    }
}
