import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { LoggingBunyan } from '@google-cloud/logging-bunyan';
import * as Bunyan from 'bunyan';
import { Stream } from 'bunyan';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService implements LoggerService {
  gcpLogger: LoggingBunyan;
  logger: Bunyan;

  constructor() {
    const streams: Stream[] = [{ stream: process.stdout, level: 'debug' }];
    this.gcpLogger = new LoggingBunyan();
    if (process.env.NODE_ENV === 'production') {
      streams.push(this.gcpLogger.stream('info'));
    }
    this.logger = Bunyan.createLogger({
      name: 'Core',
      streams,
    });
  }

  debug(message: any, ...optionalParams: any[]): any {
    this.logger.debug(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): any {
    this.logger.error(message, optionalParams);
  }

  log(message: any, ...optionalParams: any[]): any {
    this.logger.info(message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): any {
    this.logger.trace(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.logger.warn(message, optionalParams);
  }
}
