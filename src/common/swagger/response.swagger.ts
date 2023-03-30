import { HttpStatus } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces';
import { errorMessage } from 'src/common/enums/errorMessage';
import { successMessage } from 'src/common/enums/successMessage';

export const swaggerResponse = {
    createSuccess: (type: Type, isArray?: boolean) => {
        return {
            status: HttpStatus.CREATED,
            type,
            description: successMessage.CREATED,
            isArray: !!isArray
        };
    },
    getSuccess: (type: Type, isArray?: boolean) => {
        return {
            status: HttpStatus.OK,
            type,
            description: successMessage.OK,
            isArray: !!isArray
        };
    },
    badRequest: () => {
        return {
            status: HttpStatus.BAD_REQUEST,
            description: errorMessage.BAD_REQUEST,
            type: String
        };
    },
    unAuthorizedError: () => {
        return {
            status: HttpStatus.UNAUTHORIZED,
            description: errorMessage.UNAUTHORIZED,
            type: String
        };
    },
    serverError: () => {
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: errorMessage.INTERNAL_SERVER_ERROR,
            type: String
        };
    }
};
