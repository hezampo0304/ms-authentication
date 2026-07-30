import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

  private readonly logger =
    new Logger(GlobalExceptionFilter.name);

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): void {

    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();

    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let body = {
      success: false,
      code: 'SYSTEM_001',
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {

      status = exception.getStatus();

      const exceptionResponse =
        exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {

        body = {
          ...body,
          ...(exceptionResponse as object),
        };

      } else {

        body.message = String(exceptionResponse);

      }

    }

    this.logger.error({
      method: request.method,
      path: request.url,
      status,
      exception,
    });

    response.status(status).json({
      ...body,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });

  }

}