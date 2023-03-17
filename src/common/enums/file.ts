export const WhiteList = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/bmp': 'bmp',
    'image/webp': 'webp'
};

export const MagicNumber = {
    //magic number is the string of image buffer to indentify the mimetype of image
    ffd8ff: ['image/jpg', 'image/jpeg'],
    '89504e47': ['image/png'],
    '424d': ['image/bmp'],
    '52494646': ['image/webp']
};

export const FileSize = {
    min: 1, //bytes
    max: 25 * 1024 * 1024 // megabytes to bytes
};
