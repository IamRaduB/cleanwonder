import { Injectable, Logger } from '@nestjs/common';
import { Clinic } from './models/clinic';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { CloudStorageService } from '../upload/cloud-storage/cloud-storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClinicService {
  private readonly logger = new Logger(ClinicService.name);
  imagesBucket: { bucketName: string; clinicPath: string; practitionerPath: string; patientPath: string };

  constructor(
    @InjectRepository(Clinic) private clinicRepo: EntityRepository<Clinic>,
    private gStorageService: CloudStorageService,
    private config: ConfigService,
  ) {
    this.imagesBucket = this.config.get('storage.images');
  }

  async create(payload: CreateClinicDto) {
    const clinic = new Clinic();
    clinic.name = payload.name;
    clinic.addressLine1 = payload.addressLine1;
    clinic.addressLine2 = payload.addressLine2;
    clinic.logoUrl = payload.logoUrl;
    clinic.vatId = payload.vatId;
    clinic.description = payload.description;

    await this.clinicRepo.persistAndFlush(clinic);
    return clinic;
  }

  async update(id: number, payload: UpdateClinicDto) {
    const clinic = await this.clinicRepo.findOne(id);
    const oldAvatar = clinic.logoUrl;
    const updated = wrap(clinic).assign({
      ...payload,
    });
    await this.clinicRepo.flush();

    if (oldAvatar) {
      const file = CloudStorageService.imKitToCloudStorageUrl(this.imagesBucket.bucketName, oldAvatar);
      this.logger.log(`Clinic avatar already present. Removing old avatar ${file}`);
      await this.gStorageService.removeFile(this.imagesBucket.bucketName, file);
    }

    return updated;
  }

  async findByVatId(vatId: string) {
    return this.clinicRepo.find({
      vatId: new RegExp(`^${vatId}%`),
    });
  }

  async findOneByVatId(vatId: string) {
    return this.clinicRepo.findOne({
      vatId,
    });
  }
}
