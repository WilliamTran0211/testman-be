import { S3 } from 'aws-sdk';
import { MagicNumber, WhiteList } from 'src/common/constants/file.constant';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { FileSize } from 'src/common/enums/file.enum';

interface IUploadFile {
    name: string;
    data: Buffer;
}
interface IGetFile {
    url: string;
}

export class UploadS3Response {
    url: string;
}

export const uploadFile = async ({
    file,
    id,
    createdAtTimestamp,
    fileStorage
}: {
    file: IUploadFile;
    id: number;
    createdAtTimestamp: number;
    fileStorage: string;
}): Promise<UploadS3Response> => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    });
    const data = await s3
        .upload({
            Bucket:
                `${process.env.AWS_S3_BUCKET_NAME}` + fileStorage + `/${id}`,
            Key: `${createdAtTimestamp.toString()}_${file.name}`,
            Body: file.data
        })
        .promise();
    return {
        url: `${process.env.AWS_CLOUDFRONT}/${data.Key}`
    };
};

export const getFile = async (
    id: number,
    key: string,
    fileStorage: boolean
) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    });
    try {
        const gotFile = await s3
            .getObject({
                Bucket: process.env.AWS_S3_BUCKET_NAME + fileStorage + `/${id}`,
                Key: `${key}`
            })
            .promise();

        return gotFile.Body;
    } catch (error) {
        return errorMessage.NOT_FOUND_IMAGE;
    }
};

export const deleteFile = async (
    file: IGetFile,
    id: number,
    fileStorage = false
) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    });
    try {
        await s3
            .deleteObject({
                Bucket: process.env.AWS_S3_BUCKET_NAME + fileStorage,
                Key: `${id.toString()}_${file.url}`
            })
            .promise();
    } catch (error) {
        return errorMessage.NOT_FOUND_IMAGE;
    }
};

export const convertUnicodeFileName = (fileName: string): string => {
    return Buffer.from(fileName, 'ascii').toString('utf8');
};

export const validFileType = (file: Express.Multer.File): boolean => {
    let fileUploadMagicNumber = file.buffer.toString('hex', 0, 4);
    if (fileUploadMagicNumber.startsWith('ffd8ff')) {
        fileUploadMagicNumber = 'ffd8ff';
    }
    const magicResults = MagicNumber[fileUploadMagicNumber];
    const mimeType = file.mimetype;
    if (!WhiteList[mimeType] || !magicResults) {
        return false;
    }
    return true;
};

export const validFileSize = (file: Express.Multer.File): boolean => {
    const size = file.size;
    if (size < FileSize.MIN || size > FileSize.MAX) {
        return false;
    }
    return true;
};

export const uploadFileProcessor = async ({
    files,
    id,
    fileStorage
}: {
    files: Express.Multer.File[];
    id: number;
    fileStorage: string;
}): Promise<{ urls?: string[]; error?: string }> => {
    const checkResult = checkFileValid(files);
    if (checkResult?.error) {
        return checkResult;
    }
    const uploadedFiles = [];
    for await (const file of files) {
        const uploadedFile = await uploadFile({
            file: {
                data: file.buffer,
                name: file.originalname
            },
            id: Number(id ? id : 0),
            createdAtTimestamp: Number(Date.now()),
            fileStorage
        });
        uploadedFiles.push(uploadedFile.url);
    }
    return { urls: uploadedFiles, error: '' };
};

export const checkFileValid = (
    files: Array<Express.Multer.File>
): { error: string } => {
    if (!files.length) return { error: errorMessage.BAD_REQUEST };
    for (const file of files) {
        if (!validFileSize(file)) {
            return { error: errorMessage.FILE_SIZE_ALERT };
        }
        if (!validFileType(file)) {
            return { error: errorMessage.NOT_SUPPORTED_FILE };
        }
        file.originalname = convertUnicodeFileName(file.originalname);
    }
    return { error: '' };
};
