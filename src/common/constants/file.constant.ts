export const WhiteList = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/bmp': 'bmp',
    'image/webp': 'webp'
};

export const MagicNumber = {
    //magic number is the string of image buffer to identify the mimetype of image
    ffd8ff: ['image/jpg', 'image/jpeg'],
    '89504e47': ['image/png'],
    '424d': ['image/bmp'],
    '52494646': ['image/webp']
};
