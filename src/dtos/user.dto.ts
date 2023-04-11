import { Transform } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import {
    ORDER,
    USERS_FILED,
    USERS_SEARCH_FIELD
} from 'src/common/enums/fields.enum';
import { regex } from 'src/common/enums/regex';
import { STATUS } from 'src/common/enums/status';
import { Match } from 'src/decorator/match.decorator';
import { PaginationDTO } from './pagination.dto';

export class LoginDTO {
    @IsEmail()
    email: string;
    @MinLength(8)
    @MaxLength(20)
    password: string;
}
export class UserBaseDTO {
    @IsNotEmpty()
    @MaxLength(100)
    fullName: string;
    @IsDate()
    @IsOptional(null)
    @Transform(({ value }) => new Date(value))
    dayOfBirth?: Date;
    @IsPhoneNumber('VN')
    @IsOptional(null)
    phoneNumber?: string;
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    avatarId?: number;
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    bannerId?: number;
}
export class SignupDTO extends UserBaseDTO {
    @IsEmail()
    email: string;
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

export class CreateUserDTO extends SignupDTO {
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    roleId: number;
}
export class UpdateUserForAdminDTO extends UserBaseDTO {
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    roleId: number;
}

export class ChangePasswordDTO {
    @IsNotEmpty()
    @Matches(new RegExp(regex.passwordRegex), {
        message: errorMessage.WEAK_PASSWORD
    })
    oldPassword: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(new RegExp(regex.passwordRegex), {
        message: errorMessage.WEAK_PASSWORD
    })
    password: string;

    @IsNotEmpty()
    @Match('password', {
        message: errorMessage.CONFIRM_NOT_MATCH
    })
    confirmPassword: string;
}
export class GetUserQueryDTO extends PaginationDTO {
    @IsString()
    @IsOptional(null)
    searchKey?: string;
    @IsArray()
    @IsOptional(null)
    @IsEnum(USERS_SEARCH_FIELD, { each: true })
    @Transform(({ value }: { value: USERS_SEARCH_FIELD[] }) => {
        if (typeof value === 'string') return [value];
        return [...new Set(value)];
    })
    searchFields?: USERS_SEARCH_FIELD[];
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    testCaseFilter?: number;
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    projectFilter?: number;
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    roleFilter?: number;
    @IsEnum(STATUS)
    @IsOptional(null)
    statusFilter?: STATUS;
    @IsArray()
    @IsOptional(null)
    @IsEnum(USERS_FILED, { each: true })
    @Transform(({ value }: { value: USERS_SEARCH_FIELD[] }) => {
        if (typeof value === 'string') return [value];
        return [...new Set(value)];
    })
    selectedFields?: USERS_FILED[];
    @IsEnum(ORDER)
    @IsOptional(null)
    order?: ORDER;
    @IsEnum(USERS_FILED)
    @IsOptional(null)
    sort?: USERS_FILED;
}
