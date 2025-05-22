import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpenseServiceModule } from './expense-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ExpenseServiceModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Despesas')
    .setDescription('API para gerenciamento de despesas')
    .setVersion('1.0')
    .addTag('expenses')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Expense Service rodando em: http://localhost:${port}`);
  console.log(
    `Documentação Swagger disponível em: http://localhost:${port}/api`,
  );
}
bootstrap();
