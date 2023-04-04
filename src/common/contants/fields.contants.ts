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
