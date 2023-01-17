import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRole } from './models/user-role';
import { EmailState } from './models/email-state';
import { User } from './models/user';

@Module({
  imports: [MikroOrmModule.forFeature([UserRole, EmailState, User])],
  providers: [UserService],
  exports: [UserService, MikroOrmModule],
})
export class UserModule {}
