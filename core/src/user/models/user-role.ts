import { User } from './user';
import { Collection, Entity, Enum, OneToMany, PrimaryKey } from '@mikro-orm/core';

export enum UserRoles {
  PRACTITIONER = 'practitioner',
  PATIENT = 'patient',
}

@Entity()
export class UserRole {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Enum(() => UserRoles)
  name!: string;

  @OneToMany(() => User, (user) => user.role)
  users = new Collection<User>(this);
}
