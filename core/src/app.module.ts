import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PractitionerModule } from './practitioner/practitioner.module';
import { ClinicModule } from './clinic/clinic.module';
import { MailModule } from './mail/mail.module';
import { LoggerModule } from './logger/logger.module';
import constants from './config/constants';
import { UploadModule } from './upload/upload.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [constants],
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(),
    AuthModule,
    UserModule,
    PractitionerModule,
    PatientModule,
    ClinicModule,
    MailModule,
    LoggerModule,
    UploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
