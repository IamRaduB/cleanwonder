import { User } from './user';
import { Clinic } from '@core/models/clinic';
import { Practitioner } from '@core/models/practitioner';
import { Patient } from '@core/models/patient'

export interface Profile extends Patient {
  user: User
  practitioner: Practitioner
}
