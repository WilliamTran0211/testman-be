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

    inputDetect: {
        schema: {
            type: 'object',
            properties: {
                image: {
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
                password: 'StrongPassword!1',
                passwordConfirm: 'StrongPassword!1',
                name: 'Nguyễn Thanh Long'
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
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary'
                },
                name: {
                    type: 'string'
                }
            }
        }
    },

    inputChangePassword: {
        schema: {
            type: 'object',
            default: {
                oldPassword: 'StrongPassword!1',
                password: 'StrongPassword!1',
                passwordConfirm: 'StrongPassword!1'
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
    }
};
