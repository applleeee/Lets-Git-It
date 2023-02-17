import {
  BadRequestException,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utiles/http-exception.filter';

import * as morgan from 'morgan';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validationError: { target: true, value: true },
      exceptionFactory: (validationErrors: ValidationError[]) => {
        return new HttpException(
          `${validationErrors}}`,
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(morgan('dev'));
  app.enableCors();

  const PORT = process.env.PORT;
  console.log(`listening to localhost:${PORT}~`);
  await app.listen(PORT);
}
bootstrap();
