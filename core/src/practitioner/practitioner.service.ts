import { Injectable, Logger } from '@nestjs/common';
import { CreatePractitionerDto } from './dto/create-practitioner.dto';
import { UpdatePractitionerDto } from './dto/update-practitioner.dto';
import { UserService } from '../user/user.service';
import { ClinicService } from '../clinic/clinic.service';
import { Practitioner } from './models/practitioner';
import { EmailStates } from '../user/models/email-state';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { CloudStorageService } from '../upload/cloud-storage/cloud-storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PractitionerService {
  private readonly logger = new Logger(PractitionerService.name);
  imagesBucket: { bucketName: string; clinicPath: string; practitionerPath: string; patientPath: string };
  constructor(
    @InjectRepository(Practitioner) private practitionerRepo: EntityRepository<Practitioner>,
    private userService: UserService,
    private clinicService: ClinicService,
    private gStorageService: CloudStorageService,
    private config: ConfigService,
  ) {
    this.imagesBucket = this.config.get('storage.images');
  }

  async create(id: number, createPractitionerDto: CreatePractitionerDto) {
    let clinicToSave = await this.clinicService.findOneByVatId(createPractitionerDto.clinic.vatId);
    if (!clinicToSave) {
      this.logger.log(`VatID ${createPractitionerDto.clinic.vatId} not found. Creating new clinic`);
      clinicToSave = await this.clinicService.create(createPractitionerDto.clinic);
    }
    const user = await this.userService.findOne(id);

    const practitioner = new Practitioner();
    practitioner.id = id;
    practitioner.firstName = createPractitionerDto.firstName;
    practitioner.lastName = createPractitionerDto.lastName;
    practitioner.title = createPractitionerDto.title;
    practitioner.bio = createPractitionerDto.bio;
    practitioner.avatarUrl = createPractitionerDto.avatarUrl;
    practitioner.user = user;
    practitioner.clinic = clinicToSave;

    const createdPractitioner = await this.practitionerRepo.persistAndFlush(practitioner);
    await this.userService.update(id, {
      emailState: EmailStates.COMPLETED,
    });

    return createdPractitioner;
  }

  findAll() {
    return `This action returns all practitioner`;
  }

  async findOne(id: number) {
    return this.practitionerRepo.findOne(
      {
        id,
      },
      {
        populate: ['clinic', 'user', 'user.role', 'user.emailState'],
      },
    );
  }

  async update(id: number, updatePractitionerDto: UpdatePractitionerDto) {
    const practitioner = await this.practitionerRepo.findOne(id);
    const oldAvatar = practitioner.avatarUrl;
    const updated = wrap(practitioner).assign({
      ...updatePractitionerDto,
    });
    await this.practitionerRepo.flush();

    if (oldAvatar) {
      const file = CloudStorageService.imKitToCloudStorageUrl(this.imagesBucket.bucketName, oldAvatar);
      this.logger.log(`Practitioner avatar already present. Removing old avatar ${file}`);
      await this.gStorageService.removeFile(this.imagesBucket.bucketName, file);
    }

    return updated;
  }

  async getPatients(id: number) {
    const practitioner = await this.practitionerRepo.findOne(
      {
        id,
      },
      {
        populate: ['patients', 'patients.user'],
      },
    );
    return practitioner.patients;
  }

  remove(id: number) {
    return `This action removes a #${id} practitioner`;
  }
}
