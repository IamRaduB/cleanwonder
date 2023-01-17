import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppLoggerService } from './logger/logger.service';
import { JwtExceptionFilter } from './auth/jwt-exception.filter';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const logger = new AppLoggerService();
  app.enableShutdownHooks();
  app.useLogger(new AppLoggerService());

  // run the DB sync only on local
  if (!configService.get<boolean>('isProduction')) {
    logger.warn('Synchronizing database schema!');
    await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
    await app.get(MikroORM).getSchemaGenerator().updateSchema();
  }

  app.enableCors({
    origin: configService.get('corsOrigin'),
    credentials: true,
  });

  app.use(cookieParser());

  // Enable query exception filter when a proper MikroOrm error can be caught and processed ", new QueryExceptionFilter(logger)"
  app.useGlobalFilters(new JwtExceptionFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const port = configService.get<number>('port');
  await app.listen(port, '0.0.0.0');
  Logger.log(`App running on port ${port}`, 'main');
}

bootstrap();
