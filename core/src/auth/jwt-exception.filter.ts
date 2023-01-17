import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError, NotBeforeError } from 'jsonwebtoken';
import { Response } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Catch(TokenExpiredError, NotBeforeError, JsonWebTokenError)
export class JwtExceptionFilter implements ExceptionFilter {
  constructor(private logger: AppLoggerService) {}

  catch(exception: TokenExpiredError | NotBeforeError | JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof TokenExpiredError) {
      this.logger.error('JWT expired', exception);
      response.status(HttpStatus.UNAUTHORIZED).send(new UnauthorizedException('JWT expired'));
    } else if (exception instanceof NotBeforeError) {
      this.logger.error('JWT time invalid', exception);
      response.status(HttpStatus.UNAUTHORIZED).send(new UnauthorizedException('JWT time before nbf claim'));
    } else {
      this.logger.error('JWT error', exception);
      response.status(HttpStatus.UNAUTHORIZED).send(new UnauthorizedException('JWT generic error'));
    }
  }
}
