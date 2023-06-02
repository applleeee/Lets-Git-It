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
import { SwaggerSetup } from './modules/swagger/swagger';
import * as cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import * as basicAuth from 'express-basic-auth';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigType } from '@nestjs/config';
import appConfig from './config/appConfig';

async function bootstrap() {
  let httpsOptions = null;

  // if (process.env.SSL_MODE) {
  //   httpsOptions = {
  //     key: readFileSync(process.env.SSL_KEY_PATH),
  //     cert: readFileSync(process.env.SSL_CERT_PATH),
  //     ca: readFileSync(process.env.SSL_CA_PATH),
  //   };
  // }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

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

  app.set('trust proxy', true);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(morgan(process.env.NODE_ENV === 'prod' ? 'combined' : 'dev'));
  app.enableCors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  app.use(cookieParser(config.cookieSecretKey));

  const PORT = config.port;
  console.log(`Server Listening to localhost:${PORT}~`);

  // dev server & local server Swagger 연결
  if (config.nodeEnv !== 'prod') {
    app.use(
      ['/api-docs'],
      basicAuth({
        users: {
          [config.swagger.user]: `${config.swagger.password}`,
        },
        challenge: true,
      }),
    );
    new SwaggerSetup(app).setup();
  }

  await app.listen(PORT);
}

bootstrap();
