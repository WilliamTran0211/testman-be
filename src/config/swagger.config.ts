import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Test Man')
    .setDescription('The Test Man API')
    .setVersion('1.0')
    .build();
