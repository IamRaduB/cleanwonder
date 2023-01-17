import { User } from '@core/models/user';
import { Practitioner } from '@core/models/practitioner'

export interface PatientDto {
  account: {
    email: string;
    password: string;
  }

  profile: {
    firstName: string;
    lastName: string;
    birthDate: string;
    ssn: string;
    addressLine1: string;
    addressLine2: string;
    phoneNumber: string;
    avatarUrl: string;
  }
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  details: string;
  user: User;
  practitioner: Practitioner | null;
}
