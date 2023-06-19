import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('exception: ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    let code = 'HttpException';

    switch (exception.constructor) {
      case HttpException: // for HttpException
        status = (exception as HttpException).getStatus();
        break;

      case QueryFailedError: // for TypeOrm error
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;

      case BadRequestException:
        status = (exception as BadRequestException).getStatus();
        break;

      case UnauthorizedException: // for Auth guard error
        status = (exception as UnauthorizedException).getStatus();
        break;

      case ForbiddenException:
        status = (exception as ForbiddenException).getStatus();
        break;

      case NotFoundException:
        status = (exception as NotFoundException).getStatus();
        break;

      case ConflictException:
        status = (exception as ConflictException).getStatus();
        break;

      default: // default
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      message: (exception as any).message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
