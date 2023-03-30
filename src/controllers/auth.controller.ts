import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Req,
    Res,
    UnauthorizedException,
    ValidationPipe
} from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { errorMessage } from 'src/common/enums/errorMessage';
import { LoginDTO, SignupDTO } from 'src/dtos/user.dto';
import { UsersService } from 'src/services/users.service';
import * as bcrypt from 'bcrypt';
import {
    generateToken,
    setCookie
} from 'src/common/utils/helper/authorize.helper';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/enums/jwtConstants';
import { successMessage } from 'src/common/enums/successMessage';
import { ROLE } from 'src/common/enums/roles';
import { RolesService } from 'src/services/roles.service';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { swaggerResponse } from 'src/common/swagger/response.swagger';
import { User } from 'src/entities/user.entity';
import { swaggerRequest } from 'src/common/swagger/request.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UsersService,
        private roleService: RolesService,
        private jwtService: JwtService
    ) {}

    @Get('me')
    @ApiResponse(swaggerResponse.getSuccess(User))
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async getMe(@Req() request, @Res() response) {
        const user = request.user;
        const userData = await this.userService.getById({ id: user.id });
        return response.status(HttpStatus.OK).json({ info: userData });
    }

    @Post('login')
    @ApiBody(swaggerRequest.inputLogin)
    @ApiResponse(swaggerResponse.getSuccess(User))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async login(
        @Body(new ValidationPipe({ transform: true }))
        body: LoginDTO,
        @Res() response
    ) {
        const { email, password } = body;
        const existedUser = await this.userService.getByEmailWithPassword({
            email
        });
        if (!existedUser) {
            throw new UnauthorizedException(errorMessage.NOT_FOUND_USER);
        }
        const isCorrectPassword = await bcrypt.compare(
            password,
            existedUser.password
        );
        if (!isCorrectPassword) {
            throw new UnauthorizedException(errorMessage.WRONG_PASSWORD);
        }
        const userInfo = await this.userService.getById({ id: existedUser.id });
        const tokenData = generateToken({
            jwtService: this.jwtService,
            userInfo: {
                id: userInfo.id,
                email: userInfo.email
            }
        });
        await this.userService.updateRefreshToken({
            id: userInfo.id,
            refreshToken: tokenData.refresh_token
        });
        setCookie({ response, tokenData });
        return response.status(HttpStatus.OK).json({ info: userInfo });
    }
    @Post('signup')
    @ApiBody(swaggerRequest.inputSignup)
    @ApiCreatedResponse(swaggerResponse.createSuccess(String))
    @ApiBadRequestResponse(swaggerResponse.badRequest())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async signup(
        @Res() response,
        @Body(new ValidationPipe({ transform: true }))
        body: SignupDTO
    ) {
        const { email, fullName, password } = body;
        const existedUser = await this.userService.getByEmail({ email });
        if (existedUser)
            throw new BadRequestException(errorMessage.EXISTED_USER);
        const hashedPassword = await bcrypt.hash(
            password,
            jwtConstants.HASH_ROUND
        );
        const defaultRole = await this.roleService.getByName({
            name: ROLE.ADMIN
        });
        await this.userService.createUser({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role: defaultRole
            }
        });
        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.CREATED });
    }
}
