import {
    Injectable,
    NestMiddleware,
    Req,
    UnauthorizedException
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { errorMessage } from 'src/common/enums/errorMessage';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(@Req() request, response: Response, next: NextFunction) {
        const jwtService = new JwtService();
        const access_token = request.headers.authorization;
        if (!access_token) {
            throw new UnauthorizedException(errorMessage.UNAUTHORIZED, {
                description: errorMessage.UNAUTHORIZED
            });
        }
        const accessToken = access_token.split('Bearer ')[1];
        let decodedJwtAccessToken;
        try {
            decodedJwtAccessToken = jwtService.verify(accessToken, {
                secret: process.env.JWT_SECRET_KEY
            });
        } catch (error) {
            if (error.name === errorMessage.TOKEN_EXPIRED_ERROR) {
                throw new UnauthorizedException(errorMessage.TOKEN_EXPIRED, {
                    description: error
                });
            }
            throw new UnauthorizedException(errorMessage.UNAUTHORIZED, {
                description: error
            });
        }
        // get user from access_token
        // return user
        request.user = decodedJwtAccessToken;
        next();
    }
}
