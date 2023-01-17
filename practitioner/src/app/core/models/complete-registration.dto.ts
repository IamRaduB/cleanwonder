import { TypeaheadClinic } from '@core/models/clinic';

export interface CompleteRegistrationDto {
  title: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  clinic: {
    vatId: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    description: string;
    logoUrl?: string;
  }
}

export interface CompleteRegistrationFormData {
  title: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  clinic: {
    vat: TypeaheadClinic | string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    description: string;
    logo?: string;
  }
}
