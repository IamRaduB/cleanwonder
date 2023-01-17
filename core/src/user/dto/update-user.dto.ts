import { EmailStates } from '../models/email-state';

export class UpdateUserDto {
  email?: string;
  password?: string;
  emailState?: EmailStates;
}
