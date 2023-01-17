import { User } from './user';
import { Clinic } from '@core/models/clinic';
import { Practitioner } from '@core/models/practitioner';

export interface Profile extends Practitioner{
  user: User
  clinic: Clinic;
}
