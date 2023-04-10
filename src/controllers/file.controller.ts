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
import { swaggerRequest } from 'src/common/swagger/request.swagger';
import { swaggerResponse } from 'src/common/swagger/response.swagger';
import { uploadFileProcessor } from 'src/common/utils/helper/fileProcessing.helper';
import { File } from 'src/entities/file.entity';
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
    async uploadFiles(
        @Req() request,
        @Res() response,
        @UploadedFile() file: Express.Multer.File
    ) {
        const { user } = request;
        const uploadedStatus = await uploadFileProcessor([file], user.id);
        if (uploadedStatus?.error) {
            throw new BadRequestException(uploadedStatus.error);
        }
        const filesData = uploadedStatus.urls.map(url => {
            const file = { url, createdBy: user };
            return file;
        });
        const insertedValue = await this.filesService.createFiles({
            values: filesData
        });
        const insertedList = insertedValue.identifiers;
        if (!insertedList.length) {
            throw new InternalServerErrorException(errorMessage.SERVER_ERROR);
        }
        return response.status(HttpStatus.OK).json({ info: insertedList });
    }
}
