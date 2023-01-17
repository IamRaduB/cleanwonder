import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user';
import { UserRole, UserRoles } from './models/user-role';
import { EmailState, EmailStates } from './models/email-state';
import { genSalt, hash } from 'bcryptjs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, NotFoundError, wrap } from '@mikro-orm/core';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private userRepo: EntityRepository<User>,
    @InjectRepository(UserRole) private userRoleRepo: EntityRepository<UserRole>,
    @InjectRepository(EmailState) private emailStateRepo: EntityRepository<EmailState>,
  ) {}

  async create({ email, password }: CreateUserDto, roleName: UserRoles): Promise<User & { role: UserRole }> {
    try {
      const role = await this.userRoleRepo.findOne({
        name: roleName,
      });

      if (!role) {
        throw new InternalServerErrorException(`Unable to find user role record ${UserRoles.PRACTITIONER}`);
      }

      const emailState = await this.emailStateRepo.findOne({
        state: EmailStates.PENDING,
      });

      if (!emailState) {
        throw new InternalServerErrorException(`Unable to find user role record ${EmailStates.PENDING}`);
      }

      const user = new User();
      user.email = email;
      user.password = password;
      user.role = role;
      user.emailState = emailState;
      await this.userRepo.persistAndFlush(user);
      this.logger.debug(`Created user ${user.id} with role ${role.name} and email state ${emailState.state}`);
      return user;
    } catch (e) {
      this.logger.error(`Unable to create ${roleName} user`, e);
      throw e;
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.userRepo.findOne(id, {
      populate: ['emailState', 'role'],
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepo.findOne(
      {
        email,
      },
      {
        populate: ['emailState', 'role'],
      },
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne(id, {
      populate: ['emailState'],
    });
    if (!user) {
      throw new NotFoundError(`Attempted to update non-existent user ${id}`);
    }

    let emailState = user.emailState;
    if (updateUserDto.emailState) {
      this.logger.debug(`Updating email state to ${updateUserDto.emailState}`, user.id);
      emailState = await this.emailStateRepo.findOne({
        state: updateUserDto.emailState,
      });
    }

    let password = user.password;
    if (updateUserDto.password) {
      this.logger.debug(`Updating password`, user.id);
      password = await this.hashPassword(updateUserDto.password);
    }

    wrap(user).assign({
      ...updateUserDto,
      emailState,
      password,
    });

    await this.userRepo.flush();
    return user;
  }

  async hashPassword(password) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  async updatePassword(id: number, password: string) {
    const hashPassword = await this.hashPassword(password);

    const user = await this.userRepo.findOne(id);
    user.password = hashPassword;
    await this.userRepo.flush();
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
