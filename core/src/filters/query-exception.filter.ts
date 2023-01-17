import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Catch()
export class QueryExceptionFilter implements ExceptionFilter {
  constructor(private logger: AppLoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error('Unable to perform query', exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'An system query error has occurred.',
    });
  }
}
