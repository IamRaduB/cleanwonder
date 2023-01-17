import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private mailerService: MailerService, private config: ConfigService) {}

  async sendPractitionerWelcomeEmail(email: string, token: string) {
    const confirmationEmail = `http://${this.config.get<string>('clientDomain')}/${this.config.get(
      'registrationUrl',
    )}?token=${token}`;
    // TODO: Uncomment this when the email account is bought and available
    // const emailConst = this.config.get<{ from: string; subject: string }>('email');
    // if (this.config.get<boolean>('isProduction')) {
    //   return this.mailerService.sendMail({
    //     to: email, // list of receivers
    //     from: emailConst.from, // sender address
    //     subject: emailConst.subject, // Subject line
    //     template: 'practitioner-welcome',
    //     context: {
    //       link: confirmationEmail,
    //     },
    //   });
    // } else {
    this.logger.debug(confirmationEmail);
    // }
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    const link = `http://${this.config.get<string>('clientDomain')}/${this.config.get(
      'forgotPasswordUrl',
    )}?token=${token}`;
    // const emailConst = this.config.get<{ from: string; subject: string }>('email');
    // return this.mailerService.sendMail({
    //   to: email, // list of receivers
    //   from: emailConst.from, // sender address
    //   subject: 'Password recovery', // Subject line
    //   template: 'forgot-password',
    //   context: {
    //     link,
    //   },
    // });

    this.logger.debug(link);
  }

  async sendPatientWelcomeEmail(email: string, token: string) {
    const confirmationEmail = `http://${this.config.get<string>('patient.clientDomain')}/${this.config.get(
      'patient.registrationUrl',
    )}?token=${token}`;
    // TODO: Uncomment this when the email account is bought and available
    // const emailConst = this.config.get<{ from: string; subject: string }>('email');
    // if (this.config.get<boolean>('isProduction')) {
    //   return this.mailerService.sendMail({
    //     to: email, // list of receivers
    //     from: emailConst.from, // sender address
    //     subject: emailConst.subject, // Subject line
    //     template: 'practitioner-welcome',
    //     context: {
    //       link: confirmationEmail,
    //     },
    //   });
    // } else {
    this.logger.debug(confirmationEmail);
    // }
  }
}
