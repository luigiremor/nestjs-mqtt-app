import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://192.168.109.150:3001',
    credentials: true,
  });

  await app.listen(3000, '192.168.109.150');
}
bootstrap();
