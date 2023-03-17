import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Issue Detection')
    .addBearerAuth({
        name: 'Token',
        description: 'Default',
        type: 'http',
        in: 'header',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
    })
    .setDescription('The Issuse Detection Tool API description')
    .setVersion('1.0')
    .build();
