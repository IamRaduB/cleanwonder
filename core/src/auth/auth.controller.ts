import { Body, Controller, ForbiddenException, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService, JWT_EXPIRATION } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { JwtUser } from './dto/jwt-payload';
import { CustomResponse, ResponseCodes } from '../config/constants';
import { EmailStates } from '../user/models/email-state';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<CustomResponse | { user: JwtUser; token: string }> {
    const token = await this.authService.login(req.user as JwtUser, { expiresIn: JWT_EXPIRATION.LOGIN });
    // user return in req.user is the up to date one in the DB
    const emailState = (req.user as JwtUser).emailState.state;
    if (emailState === EmailStates.PENDING) {
      throw new ForbiddenException({
        status: ResponseCodes.NOT_VALIDATED,
        message: 'Email link has not been clicked',
        token,
      });
    } else if (emailState === EmailStates.VALIDATED) {
      throw new ForbiddenException({
        status: ResponseCodes.NO_PROFILE,
        message: 'Profile data has not been filled in',
        token,
      });
    }

    return {
      token,
      user: req.user as JwtUser,
    };
  }

  @Post('signup')
  async register(@Body() payload: CreateUserDto) {
    return this.authService.signupPractitioner(payload);
  }

  @Post('validate-email')
  async validateEmail(
    @Body() payload: ValidateEmailDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ token: string }> {
    const result = await this.authService.validateUserEmail(payload.token);
    return { token: result };
  }

  @Get('resend-email')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async resendEmail(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.resendPractitionerEmail(req.user as JwtUser);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    await this.authService.sendForgotPasswordEmail(payload.email);
  }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(@Req() req: Request, @Body() payload: ResetPasswordDto) {
    return this.authService.resetPassword(req.user as JwtUser, payload.password);
  }
}
