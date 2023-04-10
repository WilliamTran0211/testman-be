import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    url: string;
}

export class UploadFileDto {}

export class UpdateFileDto {}
