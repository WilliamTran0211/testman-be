import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { LoggingInterceptor } from './interceptor/logger.interceptor';
const port = process.env.PORT || 3000;
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.listen(port);
}
bootstrap().then(() => {
    console.log(`Server is listening at http://localhost:${port}`);
});
