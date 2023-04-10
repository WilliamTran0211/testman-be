import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Req,
    Res,
    UnauthorizedException,
    ValidationPipe,
    InternalServerErrorException
} from '@nestjs/common';
import {
    Delete,
    Patch,
    Post
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { ChangePasswordDTO, LoginDTO, SignupDTO } from 'src/dtos/user.dto';
import { UsersService } from 'src/services/users.service';
import * as bcrypt from 'bcrypt';
import {
    clearCookie,
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
        private rolesService: RolesService,
        private jwtService: JwtService
    ) {}

    @Get('me')
    @ApiResponse(swaggerResponse.getSuccess(User))
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async getMe(@Req() request, @Res() response) {
        const { user } = request;
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
        const { email, fullName, password, phoneNumber, dayOfBirth } = body;
        const existedUser = await this.userService.getByEmail({ email });
        if (existedUser)
            throw new BadRequestException(errorMessage.EXISTED_USER);
        const hashedPassword = await bcrypt.hash(
            password,
            jwtConstants.HASH_ROUND
        );
        const defaultRole = await this.rolesService.getByName({
            name: ROLE.USER
        });
        const result = await this.userService.createUser({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role: defaultRole,
                phoneNumber,
                dayOfBirth
            }
        });
        if (!result)
            throw new InternalServerErrorException(errorMessage.SERVER_ERROR);
        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.CREATED });
    }

    @Post('refresh-token')
    @ApiResponse(swaggerResponse.getSuccess(User))
    @ApiCreatedResponse(swaggerResponse.createSuccess(User))
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async refreshToken(
        @Req() request,
        @Res() response
    ): Promise<{ info: string }> {
        if (!request.cookies) {
            throw new UnauthorizedException(errorMessage.UNAUTHORIZED);
        }
        const { refresh_token } = request.cookies;
        if (!refresh_token) {
            throw new UnauthorizedException(errorMessage.UNAUTHORIZED);
        }
        const refreshToken = refresh_token.split('Bearer ')[1];
        const decodedJwtRefreshToken = this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_SECRET_KEY
        });
        if (!decodedJwtRefreshToken)
            throw new UnauthorizedException(errorMessage.NOT_FOUND_USER);
        const foundUser = await this.userService.getByIdWithRefreshToken({
            id: decodedJwtRefreshToken.id
        });
        if (!foundUser) {
            throw new UnauthorizedException(errorMessage.NOT_FOUND_USER);
        }
        const tokenData = generateToken({
            jwtService: this.jwtService,
            userInfo: { id: foundUser.id, email: foundUser.email }
        });
        await this.userService.updateRefreshToken({
            id: decodedJwtRefreshToken.id,
            refreshToken: tokenData.refresh_token
        });
        setCookie({ response, tokenData });
        return response.status(HttpStatus.OK).json({
            info: successMessage.OK
        });
    }

    @Patch('change-password')
    @ApiBody(swaggerRequest.inputChangePassword)
    @ApiResponse(swaggerResponse.getSuccess(String))
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async changeUserPassword(
        @Body(new ValidationPipe({ transform: true }))
        body: ChangePasswordDTO,
        @Req() request,
        @Res() response
    ) {
        const { user } = request;
        const { oldPassword, password } = body;
        const foundUser = await this.userService.getByIdWithPassword({
            id: user.id
        });
        if (!foundUser) {
            throw new BadRequestException(errorMessage.NOT_FOUND_USER);
        }

        const isCorrectCurrentPassword = await bcrypt.compare(
            oldPassword,
            foundUser.password
        );

        if (!isCorrectCurrentPassword) {
            throw new UnauthorizedException(
                errorMessage.WRONG_CURRENT_PASSWORD
            );
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const results = await this.userService.update({
            id: user.id,
            data: { password: hashPassword }
        });

        if (!results.affected) {
            throw new InternalServerErrorException(errorMessage.SERVER_ERROR);
        }
        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.CHANGE_PASSWORD_SUCCESS });
    }

    @Delete('logout')
    @ApiResponse(swaggerResponse.getSuccess(User))
    @ApiCreatedResponse(swaggerResponse.createSuccess(User))
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    async logout(@Res() response): Promise<{ info: string }> {
        clearCookie(response);
        return response
            .status(HttpStatus.OK)
            .json({ info: successMessage.DELETED });
    }
}
