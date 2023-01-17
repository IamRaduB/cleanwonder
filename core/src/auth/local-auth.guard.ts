import { AuthGuard } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // if validateUser returns null user and does not throw an error
    // send a 404 to the client
    if (!user && !err) {
      throw new NotFoundException('User not found');
    }

    // if any kind of error was thrown in validateUser
    // pass that error forward
    if (err) {
      throw err;
    }

    return user;
  }
}
