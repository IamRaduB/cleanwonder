import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Patient } from './models/patient';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UserService } from '../user/user.service';
import { v4 } from 'uuid';
import { UserRoles } from '../user/models/user-role';
import { MailService } from '../mail/mail.service';
import { AuthService, JWT_EXPIRATION } from '../auth/auth.service';
import { PractitionerService } from '../practitioner/practitioner.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { NotFoundError } from 'rxjs';
import { EmailStates } from '../user/models/email-state';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);
  constructor(
    @InjectRepository(Patient) private patientRepo: EntityRepository<Patient>,
    private practitionerService: PractitionerService,
    private userService: UserService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  async create(loggedInPractitionerId: number, createPatientDto: CreatePatientDto) {
    // 1. create user
    const password = v4().split('-')[4];
    const user = await this.userService.create(
      {
        email: createPatientDto.email,
        password,
      },
      UserRoles.PATIENT,
    );

    const practitioner = await this.practitionerService.findOne(loggedInPractitionerId);
    if (!practitioner) {
      throw new UnauthorizedException(`Unable to create patient for practitioner ${loggedInPractitionerId}`);
    }

    // 2. create patient
    try {
      const patient = new Patient();
      patient.id = user.id;
      patient.firstName = createPatientDto.firstName;
      patient.lastName = createPatientDto.lastName;
      patient.birthDate = new Date(createPatientDto.birthDate);
      patient.ssn = createPatientDto.ssn;
      patient.phoneNumber = createPatientDto.phoneNumber;
      patient.addressLine1 = createPatientDto.addressLine1;
      patient.addressLine2 = createPatientDto.addressLine2;
      patient.details = createPatientDto.details;
      patient.user = user;
      patient.practitioner = practitioner;

      await this.patientRepo.persistAndFlush(patient);

      // 3. send confirmation email
      const token = await this.authService.login(user, { expiresIn: JWT_EXPIRATION.EMAIL_CONFIRMATION });
      await this.mailService.sendPatientWelcomeEmail(user.email, token);

      return {
        ...patient,
        practitioner: undefined,
        user: {
          ...user,
          patient: undefined,
          practitioner: undefined,
        },
      };
    } catch (e: any) {
      this.logger.error('Unable to create patient', e);
      throw new InternalServerErrorException(e);
    }
  }

  async getPatientById(id: number) {
    return this.patientRepo.findOne(
      {
        id,
      },
      {
        populate: ['user', 'practitioner'],
      },
    );
  }

  async confirmPatient(id: number, updatePatient: UpdatePatientDto) {
    try {
      const user = await this.userService.update(id, {
        ...updatePatient.account,
        emailState: EmailStates.COMPLETED,
      });
      if (!user) {
        throw new UnauthorizedException(`Attempted to confirm patient profile of non-existent user ${id}`);
      }

      this.logger.debug('Updated patient account credentials', id, updatePatient.account.email);
      const patient = await this.patientRepo.findOne(id, {
        populate: ['user', 'practitioner'],
      });
      if (!patient) {
        throw new NotFoundError('Unable to confirm patient account. Not found!');
      }

      const updatedPatient = wrap(patient).assign({
        ...updatePatient.profile,
        birthDate: new Date(updatePatient.profile.birthDate),
      });

      await this.patientRepo.persistAndFlush(updatedPatient);

      this.logger.debug('Updated patient profile details', id, updatePatient.account.email);
      return updatedPatient;
    } catch (e) {
      throw e;
    }
  }
}
