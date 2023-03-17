export const envFilePath = {
    envFilePath:
        process.env.APP_ENV === 'production' ? '.env.production' : '.env'
};
