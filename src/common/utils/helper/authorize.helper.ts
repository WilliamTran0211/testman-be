import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/enums/jwtConstants';

export const generateToken = ({
    jwtService,
    userInfo
}: {
    jwtService: JwtService;
    userInfo: { id: number; email: string };
}) => {
    const { id, email } = userInfo;
    return {
        access_token: jwtService.sign({ id, email }),
        expires_in: jwtConstants.EXPIRED_IN,
        refresh_token: jwtService.sign(
            { id, email },
            {
                expiresIn: jwtConstants.REFRESH_EXPIRED_IN
            }
        ),
        scope: '',
        token_type: jwtConstants.TYPE
    };
};

export const setCookie = ({ response, tokenData }) => {
    response.cookie('access_token', `Bearer ${tokenData.access_token}`, {
        httpOnly: true
    });
    response.cookie('refresh_token', `Bearer ${tokenData.refresh_token}`, {
        httpOnly: true
    });
};
export const clearCookie = response => {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
};
