import {
  ValidationPipe,
  HttpException,
  HttpStatus,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/http-exception.filter';

import * as morgan from 'morgan';
import { ValidationError } from 'class-validator';
import { SwaggerSetup } from './utils/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
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
  app.enableCors({
    origin: process.env.CORS_ORIGIN || process.env.CORS_LOCAL_ORIGIN,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

  const PORT = process.env.PORT;
  console.log(`Server Listening to localhost:${PORT}~`);

  //Swagger 환경설정 연결
  new SwaggerSetup(app).setup();

  await app.listen(PORT);
}
bootstrap();
