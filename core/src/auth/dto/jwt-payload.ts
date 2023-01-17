import { UserRole } from '../../user/models/user-role';
import { EmailState } from '../../user/models/email-state';

export interface JwtPayload {
  email: string;
  sub: number;
  role: UserRole;
  emailState: EmailState;
}

export interface JwtUser {
  id: number;
  email: string;
  role: UserRole;
  emailState: EmailState;
}
