import { S3 } from 'aws-sdk';
import { errorMessage } from 'src/common/enums/errorMessage.enum';
import { FileSize, MagicNumber, WhiteList } from 'src/common/enums/file';

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

export const uploadFile = async (
    file: IUploadFile,
    contentTypeId: number,
    createdAtTimestamp: number
): Promise<UploadS3Response> => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    });
    const data = await s3
        .upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME + `/${contentTypeId}`,
            Key: `${createdAtTimestamp.toString()}_${file.name}`,
            Body: file.data
        })
        .promise();

    return {
        url: `${process.env.AWS_CLOUDFRONT}/${data.Key}`
    };
};

export const getFile = async (contentTypeId: number, id: string) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    });
    try {
        const gotFile = await s3
            .getObject({
                Bucket: process.env.AWS_S3_BUCKET_NAME + `/${contentTypeId}`,
                Key: `${id}`
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
    isAvatar = false
) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    });
    try {
        await s3
            .deleteObject({
                Bucket:
                    process.env.AWS_S3_BUCKET_NAME +
                    `${isAvatar ? '/avatar' : '/detected'}`,
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
    if (size < FileSize.min || size > FileSize.max) {
        return false;
    }
    return true;
};

export const toBase64 = (arr: any) => {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer

    return btoa(
        arr.reduce(
            (data: any, byte: any) => data + String.fromCharCode(byte),
            ''
        )
    );
};
