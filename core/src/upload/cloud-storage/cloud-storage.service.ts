import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

@Injectable()
export class CloudStorageService {
  private readonly logger = new Logger(CloudStorageService.name);

  constructor(private config: ConfigService) {}

  static imKitToCloudStorageUrl(bucketName: string, fileName: string) {
    const imKitBase = 'https://ik.imagekit.io/';
    // https://storage.googleapis.com/bucketname/folder/imagename.ext
    // https://ik.imagekit.io/cleanwonder/clinic/dbaf501b-57e0-4161-86e2-1a5e84afe962.jpeg
    const noRoot = fileName.replace(imKitBase, '');
    return noRoot.substring(noRoot.indexOf('/') + 1);
  }

  async generateUploadUrl(bucketName: string, fileName: string, contentType: string) {
    const storage = this.getUploadStorage();
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    };

    // Get a v4 signed URL for uploading file
    const file = storage.bucket(bucketName).file(fileName);

    try {
      const [url] = await file.getSignedUrl(options);
      return url;
    } catch (e) {
      this.logger.error('Unable to generate signed url');
      this.logger.error(e);
      throw new InternalServerErrorException('Unable to generate signed url');
    }
  }

  async removeFile(bucketName: string, fileName: string) {
    const storage = this.getUploadStorage();
    try {
      await storage.bucket(bucketName).file(fileName).delete();
    } catch (e: any) {
      this.logger.error(`Unable to remove file ${fileName}`);
      this.logger.error(e);
      throw new InternalServerErrorException('Unable to remove file');
    }
  }

  getUploadStorage(): Storage {
    if (this.config.get<boolean>('isProduction')) {
      this.logger.debug('Creating production storage (no service account)');
      return new Storage();
    } else {
      this.logger.debug('Creating development storage (with service account)');
      return new Storage({
        keyFilename: resolve(this.config.get('storageServiceAccountPath')),
      });
    }
  }
}
