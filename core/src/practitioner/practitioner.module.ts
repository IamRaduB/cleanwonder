import { Module } from '@nestjs/common';
import { PractitionerService } from './practitioner.service';
import { PractitionerController } from './practitioner.controller';
import { UserModule } from '../user/user.module';
import { ClinicModule } from '../clinic/clinic.module';
import { AuthModule } from '../auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Practitioner } from './models/practitioner';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UserModule, ClinicModule, AuthModule, UploadModule, MikroOrmModule.forFeature([Practitioner])],
  controllers: [PractitionerController],
  providers: [PractitionerService],
  exports: [PractitionerService, MikroOrmModule],
})
export class PractitionerModule {}
