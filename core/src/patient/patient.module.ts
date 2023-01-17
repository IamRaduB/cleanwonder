import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Patient } from './models/patient';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { PractitionerModule } from '../practitioner/practitioner.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UserModule, AuthModule, MailModule, PractitionerModule, UploadModule, MikroOrmModule.forFeature([Patient])],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [MikroOrmModule],
})
export class PatientModule {}
