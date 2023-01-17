import { AuthGuard } from '@nestjs/passport';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (err) {
      throw new InternalServerErrorException(err);
    }

    return user;
  }
}
