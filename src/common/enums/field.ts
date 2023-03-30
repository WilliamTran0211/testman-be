export enum ORDER {
    ASC = 'ASC',
    DESC = 'DESC'
}
export enum SORT_FIELD {
    DETAIL = 'detail',
    ATTACHMENTS_QUANTITY = 'attachments_quantity',
    CREATED_AT = 'created_at',
    CATEGORY = 'category.id',
    CONTENT_TYPE = 'contentType.id',
    VIEW = 'views',
    TITLE = 'content.title'
}

export const ROLE_FIELD = {
    id: true,
    name: true,
    permissions: true
};

export const PERMISSION_FIELD = {
    id: true,
    name: true,
    resources: true
};

export const USER_FIELD = {
    id: true,
    email: true,
    fullName: true,
    phoneNumber: true,
    dayOfBirth: true,
    role: ROLE_FIELD,
    status: true
};

export const USER_FIELD_WITH_PASSWORD = {
    id: true,
    email: true,
    password: true,
    fullName: true,
    phoneNumber: true,
    status: true
};

export const USER_FIELD_WITH_REFRESH_TOKEN = {
    id: true,
    email: true,
    fullName: true,
    phoneNumber: true,
    refreshToken: true,
    status: true
};

export enum CATEGORIES_SEARCH_FIELD {
    TITLE = '1',
    CREATED_BY_ID = '2',
    CREATED_BY_NAME = '3',
    TITLE_DESCRIPTION = '4'
}
