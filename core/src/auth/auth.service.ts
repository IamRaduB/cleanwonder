import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { JwtPayload, JwtUser } from './dto/jwt-payload';
import { UserRoles } from '../user/models/user-role';
import { EmailStates } from '../user/models/email-state';
import { ResponseCodes } from '../config/constants';

export enum JWT_EXPIRATION {
  LOGIN = 60 * 60 * 1000,
  EMAIL_CONFIRMATION = 24 * 60 * 60 * 1000,
  FORGOT_PASWORD = 24 * 60 * 60 * 1000,
}

@Injectable()
export class AuthService {
  private log: Logger = new Logger(AuthService.name);
  constructor(private userService: UserService, private jwt: JwtService, private mailService: MailService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isPwdMatch = await compare(password, user.password);

    if (!isPwdMatch) {
      throw new UnauthorizedException('Credentials invalid');
    }
    return user;
  }

  async login(user: JwtUser, options?: JwtSignOptions) {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role, emailState: user.emailState };
    return this.jwt.sign(payload, options);
  }

  async signupPractitioner(payload: CreateUserDto) {
    // create user
    const createdUser = await this.userService.create(payload, UserRoles.PRACTITIONER);
    const token = await this.login(createdUser, { expiresIn: JWT_EXPIRATION.EMAIL_CONFIRMATION });
    // send confirmation email
    return this.mailService.sendPractitionerWelcomeEmail(createdUser.email, token);
  }

  async resendPractitionerEmail(userData: JwtUser) {
    // mark email as pending
    await this.userService.update(userData.id, {
      emailState: EmailStates.PENDING,
    });
    // generate a jwt lasting 24h
    const token = await this.login(userData, { expiresIn: JWT_EXPIRATION.EMAIL_CONFIRMATION });

    // send the confirmation email
    return this.mailService.sendPractitionerWelcomeEmail(userData.email, token);
  }

  async resetPassword(user: JwtUser, password: string) {
    const dbUser = await this.userService.findOne(user.id);
    if (!dbUser) {
      throw new ForbiddenException(`Attempted password reset for nonexistent user ${user.email}`);
    }
    await this.userService.updatePassword(dbUser.id, password);
  }

  async validateUserEmail(token: string): Promise<string> {
    // verify validity of the token
    const payload: JwtPayload = await this.jwt.verifyAsync(token);

    // check if a user exists for the provided token
    const user = await this.userService.findOneByEmail(payload.email);

    if (!user) {
      throw new NotFoundException(`Unable to validate email for user ${payload.email}. User not found.`);
    }

    this.log.debug(user);

    if (user.emailState.state === EmailStates.VALIDATED) {
      this.log.debug(`Email already validated for user ${user.id}`, user.emailState);
      throw new ForbiddenException({
        status: ResponseCodes.ALREADY_VALIDATED,
        message: 'Email already validated',
      });
    }
    await this.userService.update(user.id, { emailState: EmailStates.VALIDATED });
    return this.login(user, { expiresIn: JWT_EXPIRATION.LOGIN });
  }

  async sendForgotPasswordEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('No user could be found with the provided email address.');
    }

    const token = await this.login(user, { expiresIn: JWT_EXPIRATION.FORGOT_PASWORD });
    await this.mailService.sendForgotPasswordEmail(email, token);
  }
}
