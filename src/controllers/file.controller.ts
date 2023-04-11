import {
    BadRequestException,
    Controller,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Req,
    Res,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { FileStorage, FileStorageDatabase } from 'src/common/enums/file.enum';
import { swaggerRequest } from 'src/common/swagger/request.swagger';
import { swaggerResponse } from 'src/common/swagger/response.swagger';
import { uploadFileProcessor } from 'src/common/utils/helper/fileProcessing.helper';
import { File } from 'src/entities/file.entity';
import { User } from 'src/entities/user.entity';
import { FilesService } from 'src/services/files.service';

@ApiTags('File')
@Controller('file')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('/user/avatar')
    @ApiBody(swaggerRequest.inputUploadAvatar)
    @ApiConsumes('multipart/form-data')
    @ApiResponse(swaggerResponse.getSuccess(File))
    @ApiCreatedResponse(swaggerResponse.createSuccess(File))
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    @UseInterceptors(FileInterceptor('file'))
    async uploadUserAvatar(
        @Req() request,
        @Res() response,
        @UploadedFile() file: Express.Multer.File
    ) {
        const insertedList = await this.handleUploadFile({
            user: request.user,
            file: [file],
            storage: FileStorage.USER_AVATAR,
            databaseRelation: FileStorageDatabase.USER_AVATAR
        });
        return response.status(HttpStatus.OK).json({ info: insertedList });
    }
    @Post('/user/banner')
    @ApiBody(swaggerRequest.inputUploadAvatar)
    @ApiConsumes('multipart/form-data')
    @ApiResponse(swaggerResponse.getSuccess(File))
    @ApiCreatedResponse(swaggerResponse.createSuccess(File))
    @ApiUnauthorizedResponse(swaggerResponse.unAuthorizedError())
    @ApiInternalServerErrorResponse(swaggerResponse.serverError())
    @UseInterceptors(FileInterceptor('file'))
    async uploadUserBanner(
        @Req() request,
        @Res() response,
        @UploadedFile() file: Express.Multer.File
    ) {
        const insertedList = await this.handleUploadFile({
            user: request.user,
            file: [file],
            storage: FileStorage.USER_BANNER,
            databaseRelation: FileStorageDatabase.USER_BANNER
        });
        return response.status(HttpStatus.OK).json({ info: insertedList });
    }
    handleUploadFile = async ({
        user,
        file,
        storage,
        databaseRelation
    }: {
        user: User;
        file: Express.Multer.File[];
        storage: FileStorage;
        databaseRelation: FileStorageDatabase;
    }) => {
        if (file.length == 0)
            throw new BadRequestException(errorMessage.BAD_REQUEST);
        const uploadedStatus = await uploadFileProcessor({
            files: file,
            id: user.id,
            fileStorage: storage
        });
        if (uploadedStatus?.error) {
            throw new BadRequestException(uploadedStatus.error);
        }
        const filesData = uploadedStatus.urls.map(url => {
            const file = { url, createdBy: user };
            file[databaseRelation] = user;
            return file;
        });
        const insertedValue = await this.filesService.createFiles({
            values: filesData
        });
        const insertedList = insertedValue.identifiers;
        if (!insertedList.length) {
            throw new InternalServerErrorException(errorMessage.SERVER_ERROR);
        }
        return insertedList;
    };
}
