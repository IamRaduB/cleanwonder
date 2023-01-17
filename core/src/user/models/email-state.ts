import { User } from './user';
import { Collection, Entity, Enum, OneToMany, PrimaryKey } from '@mikro-orm/core';

export enum EmailStates {
  PENDING = 'pending',
  VALIDATED = 'validated',
  COMPLETED = 'completed',
}

@Entity()
export class EmailState {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Enum(() => EmailStates)
  state: EmailStates = EmailStates.PENDING;

  @OneToMany(() => User, (user) => user.emailState)
  users = new Collection<User>(this);
}
