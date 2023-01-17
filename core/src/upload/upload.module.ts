import { Module } from '@nestjs/common';
import { CloudStorageService } from './cloud-storage/cloud-storage.service';
import { UploadService } from './upload.service';

@Module({
  imports: [],
  providers: [CloudStorageService, UploadService],
  exports: [CloudStorageService, UploadService],
})
export class UploadModule {}
