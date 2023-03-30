import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { LoggingInterceptor } from './interceptor/logger.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';

const port = process.env.PORT || 3000;
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.setGlobalPrefix('api');
    app.enableCors();
    app.use(cookieParser());
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);
    await app.listen(port);
}
bootstrap().then(() => {
    console.log(`Server is listening at http://localhost:${port}`);
});
