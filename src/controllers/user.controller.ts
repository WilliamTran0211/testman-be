import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    async getMe(@Req() request, @Res() response) {
        const userData = await this.userService.user();
        return response.status(HttpStatus.OK).json({ userData });
    }
    @Get('create')
    async create(@Req() request, @Res() response) {
        const userData = await this.userService.create();
        return response.status(HttpStatus.OK).json({ userData });
    }
}
