import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue: 'finance.transaction.updated',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    }
  })

  await app.startAllMicroservices();
  
  const port = process.env.PORT ?? 3005;
  console.log(`Server port: ${port}`);
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
