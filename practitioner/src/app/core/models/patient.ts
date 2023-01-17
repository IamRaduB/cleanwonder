import { User } from '@core/models/user';

export interface PatientDto {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  details: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  details: string;
  user: User;
}
