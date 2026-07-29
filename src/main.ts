import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
  );

  app.use(helmet());
  app.use(compression());

  app.setGlobalPrefix(configService.get<string>('API_PREFIX')!);

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);

  console.log(`ms-authentication running on port ${port}`);
}

bootstrap();
