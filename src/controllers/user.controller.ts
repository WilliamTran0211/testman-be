import {
    Controller,
    Get,
    HttpStatus,
    Query,
    Req,
    Res,
    ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    customFilter,
    customSelectedFields,
    pagination,
    search
} from 'src/common/utils/helper/query.helper';
import { GetUserQuery } from 'src/dtos/user.dto';
import { UsersService } from 'src/services/users.service';

@ApiTags('User')
@Controller('users')
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
            limit
        } = query;
        const searchOptions = search({ searchFields, searchKey });
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
            paginationOptions
        });
        return response.status(HttpStatus.OK).json({ info: users });
    }
}
