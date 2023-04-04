import { Controller } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UsersService) {}
}
