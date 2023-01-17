import { Injectable, Logger } from '@nestjs/common';
import { CloudStorageService } from './cloud-storage/cloud-storage.service';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { extension } from 'mime-types';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  imagesBucket: { bucketName: string; clinicPath: string; practitionerPath: string; patientPath: string };
  constructor(private cloudStorageService: CloudStorageService, private config: ConfigService) {
    this.imagesBucket = this.config.get('storage.images');
  }

  getClinicAvatarUploadUrl(contentType: string) {
    const ext = extension(contentType);
    const destination = `${this.imagesBucket.clinicPath}/${v4()}.${ext}`;
    this.logger.debug(`Generating clinic avatar upload url for file ${destination}`);
    return this.cloudStorageService.generateUploadUrl(this.imagesBucket.bucketName, destination, contentType);
  }

  getPractitionerAvatarUploadUrl(contentType: string) {
    const ext = extension(contentType);
    const destination = `${this.imagesBucket.practitionerPath}/${v4()}.${ext}`;
    this.logger.debug(`Generating practitioner avatar upload url for file ${destination}`);
    return this.cloudStorageService.generateUploadUrl(this.imagesBucket.bucketName, destination, contentType);
  }

  getPatientAvatarUploadUrl(contentType: string) {
    const ext = extension(contentType);
    const destination = `${this.imagesBucket.patientPath}/${v4()}.${ext}`;
    this.logger.debug(`Generating patient avatar upload url for file ${destination}`);
    return this.cloudStorageService.generateUploadUrl(this.imagesBucket.bucketName, destination, contentType);
  }
}
