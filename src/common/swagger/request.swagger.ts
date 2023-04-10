export const swaggerRequest = {
    inputUpdateIssue: {
        schema: {
            type: 'object',
            default: {
                image: 'image_file_name.jpg',
                storage: 'history',
                detected: [
                    {
                        name: 'Detect name',
                        accuracy: 0.6,
                        detail: 'Detection details',
                        detectedImage: 'image_detected_filename.jpg'
                    }
                ]
            }
        }
    },

    inputDeleteIssue: {
        schema: {
            type: 'object',
            default: {
                issues: ['635f85eafb1dad75faeb569e', '635f85f2fb1dad75faeb56a0']
            }
        }
    },

    inputUploadAvatar: {
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    },

    inputSignup: {
        schema: {
            type: 'object',
            default: {
                email: 'longnt@nexondv.com',
                fullName: 'Nguyễn Thanh Long',
                password: 'StrongPassword!1',
                confirmPassword: 'StrongPassword!1',
                phoneNumber: '0388813493',
                dayOfBirth: '10/04/2000'
            }
        }
    },

    inputLogin: {
        schema: {
            type: 'object',
            default: {
                email: 'longnt@nexondv.com',
                password: 'StrongPassword!1'
            }
        }
    },

    inputUpdateUser: {
        schema: {
            type: 'object',
            default: {
                fullName: 'Nguyễn Thanh Long',
                phoneNumber: '0388813493',
                dayOfBirth: '10/04/2000',
                avatarId: 1
            }
        }
    },
    inputUpdateUserForAdmin: {
        schema: {
            type: 'object',
            default: {
                fullName: 'Nguyễn Thanh Long',
                roleId: 2,
                phoneNumber: '0388813493',
                dayOfBirth: '10/04/2000'
            }
        }
    },
    inputCreateUser: {
        schema: {
            type: 'object',
            default: {
                email: 'longnt@nexondv.com',
                fullName: 'Nguyễn Thanh Long',
                password: 'StrongPassword!1',
                confirmPassword: 'StrongPassword!1',
                roleId: 2,
                phoneNumber: '0388813493',
                dayOfBirth: '10/04/2000'
            }
        }
    },
    inputChangePassword: {
        schema: {
            type: 'object',
            default: {
                oldPassword: 'StrongPassword!1',
                password: 'StrongPassword!1',
                confirmPassword: 'StrongPassword!1'
            }
        }
    },
    refreshToken: {
        schema: {
            type: 'object',
            default: {
                refreshToken:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzViNWExMGU0NGI1NGM1NGIwODU3MmIiLCJlbWFpbCI6ImxvbmdudEBuZXhvbmR2LmNvbSIsImlhdCI6MTY2OTYxMTM3MiwiZXhwIjoxNjY5NjI5MzcxfQ.U--ioD6e9tQvROO7WICoxYHwA9J0faUkQ87wZqB9LUs'
            }
        }
    },
    inputRole: {
        schema: {
            type: 'object',
            default: {
                name: 'ADMIN',
                permissions: [1, 2, 3, 4, 5]
            }
        }
    },
    inputPermission: {
        schema: {
            type: 'object',
            default: {
                name: 'create',
                resource: 'user'
            }
        }
    }
};
