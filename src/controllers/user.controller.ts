import {
    Controller,
    Get,
    HttpStatus,
    Query,
    Res,
    ValidationPipe
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { swaggerResponse } from 'src/common/swagger/response.swagger';
import {
    customFilter,
    customSelectedFields,
    customSort,
    pagination,
    search
} from 'src/common/utils/helper/query.helper';
import { GetUserQuery } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/services/users.service';

@ApiTags('User')
@Controller('users')
@ApiResponse(swaggerResponse.getSuccess(User))
@ApiBadRequestResponse(swaggerResponse.badRequest())
@ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
@ApiInternalServerErrorResponse(swaggerResponse.serverError())
export class UsersController {
    constructor(private readonly userService: UsersService) {}
    @Get()
    async getUsers(
        @Res() response,
        @Query(new ValidationPipe({ transform: true }))
        query: GetUserQuery
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
