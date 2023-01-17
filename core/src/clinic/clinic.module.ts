import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Clinic } from './models/clinic';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [MikroOrmModule.forFeature([Clinic]), UploadModule],
  controllers: [ClinicController],
  providers: [ClinicService],
  exports: [ClinicService, MikroOrmModule],
})
export class ClinicModule {}
