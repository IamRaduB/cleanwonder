import { DateType, Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../user/models/user';
import { Practitioner } from '../../practitioner/models/practitioner';

@Entity()
export class Patient {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({
    type: DateType,
  })
  birthDate!: Date;

  @Property({
    unique: true,
    nullable: false,
  })
  ssn!: string;

  @Property({
    nullable: false,
  })
  addressLine1!: string;

  @Property({
    nullable: true,
  })
  addressLine2?: string;

  @Property({
    nullable: false,
  })
  phoneNumber!: string;

  @Property({
    columnType: 'mediumtext',
    nullable: true,
  })
  details?: string;

  @OneToOne(() => User, (user) => user.patient, { owner: true, orphanRemoval: true })
  user!: User;

  @ManyToOne(() => Practitioner)
  practitioner!: Practitioner;
}
