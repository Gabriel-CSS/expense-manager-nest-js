import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
        queue: process.env.RABBITMQ_NOTIFICATION_QUEUE || 'notification_queue',
        queueOptions: { durable: true },
      },
    },
  );

  await app.listen();
  console.log('Notification service está escutando eventos...');
}

bootstrap();
