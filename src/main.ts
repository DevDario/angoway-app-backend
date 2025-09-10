import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { ValidationPipe } from '@nestjs/common';
import { ensureSampleData } from './seeder/registry-sample-data';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    patchNestjsSwagger();

    const config = new DocumentBuilder().setTitle('AngowayApp API')
    .setDescription('Angoway App Backend Description')
    .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
        'access-token')
    .setVersion('1.2')
    .build();

    const document = SwaggerModule.createDocument(app, config);;

    SwaggerModule.setup('api-doc', app, document);

    app.enableCors({ origin:"*" })
    const port = process.env.PORT || 3000;
    // Ensure sample data exists before starting the server (idempotent)
    try {
        await ensureSampleData();
    } catch (err) {
        console.error('Seeder failed; continuing startup (check logs)');
    }

    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Swagger is running on: ${await app.getUrl()}/api-doc`);
}
bootstrap();
