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

export enum USERS_SEARCH_FIELD {
    FULL_NAME = 'fullName',
    EMAIL = 'email',
    DAY_OF_BIRTH = 'dayOfBirth',
    PHONE_NUMBER = 'phoneNumber'
}

export enum USERS_FILED {
    EMAIL = 'email',
    FULL_NAME = 'fullName',
    PHONE_NUMBER = 'phoneNumber',
    DAY_OF_BIRTH = 'dayOfBirth',
    ROLE = 'role',
    STATUS = 'status'
}
