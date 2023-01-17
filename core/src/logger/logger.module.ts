import { Module } from '@nestjs/common';
import { AppLoggerService } from './logger.service';

@Module({
  providers: [AppLoggerService],
})
export class LoggerModule {}
