import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/enums/jwtConstants';

@Module({
    imports: [
        {
            ...JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
                signOptions: { expiresIn: jwtConstants.EXPIRED_IN }
            }),
            global: true
        }
    ],
    exports: [JwtModule]
})
export class JWTCustomModule {}
