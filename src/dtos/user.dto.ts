import {
    IsEmail,
    IsNotEmpty,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';
import { errorMessage } from 'src/common/enums/errorMessage';
import { regex } from 'src/common/enums/regex';
import { Match } from 'src/decorator/match.decorator';

export class LoginDTO {
    @IsEmail()
    email: string;
    @MinLength(8)
    @MaxLength(20)
    password: string;
}

export class SignupDTO {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MaxLength(100)
    fullName: string;
    @MinLength(8)
    @MaxLength(20)
    @Matches(new RegExp(regex.passwordRegex), {
        message: errorMessage.WEAK_PASSWORD
    })
    password: string;
    @MinLength(8)
    @MaxLength(20)
    @Match('password', { message: errorMessage.CONFIRM_NOT_MATCH })
    confirmPassword: string;
}
