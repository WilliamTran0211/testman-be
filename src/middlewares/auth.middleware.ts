import { NextFunction, Response } from 'express';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { JwtService } from '@nestjs/jwt';
import {
    Injectable,
    NestMiddleware,
    Req,
    UnauthorizedException
} from '@nestjs/common';
import { UsersService } from 'src/services/users.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}
    async use(@Req() request, response: Response, next: NextFunction) {
        if (!request.cookies)
            throw new UnauthorizedException(errorMessage.UNAUTHORIZED);
        const access_token = request.cookies.access_token;
        if (!access_token)
            throw new UnauthorizedException(errorMessage.UNAUTHORIZED);
        const accessToken = access_token.split('Bearer ')[1];
        let decodedJwtAccessToken;
        try {
            decodedJwtAccessToken = this.jwtService.verify(accessToken, {
                secret: process.env.JWT_SECRET_KEY
            });
        } catch (error) {
            if (error.name === errorMessage.TOKEN_EXPIRED_ERROR) {
                throw new UnauthorizedException(errorMessage.TOKEN_EXPIRED);
            }
            throw new UnauthorizedException(errorMessage.UNAUTHORIZED);
        }
        // get user from access_token
        const user = await this.userService.getByIdWithRefreshToken(
            decodedJwtAccessToken.id
        );
        //invalid data refresh token
        if (!user || !user.refreshToken)
            throw new UnauthorizedException(errorMessage.UNAUTHORIZED);
        // return user
        request.user = decodedJwtAccessToken;
        request.user.role = user['role'];
        next();
    }
}
