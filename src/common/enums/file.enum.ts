export enum FileSize {
    MIN = 1, //bytes
    MAX = 25 * 1024 * 1024 // megabytes to bytes
}

export enum FileStorage {
    USER_AVATAR = '/user/avatar',
    USER_BANNER = '/user/banner',
    PROJECT_AVATAR = '/project/avatar',
    PROJECT_BANNER = '/project/banner',
    TEST_CASE = '/test-case'
}

export enum FileStorageDatabase {
    USER_AVATAR = 'userAvatar',
    USER_BANNER = 'userBanner',
    PROJECT_AVATAR = 'projectAvatar',
    PROJECT_BANNER = 'projectBanner',
    TEST_CASE = 'testCase'
}
