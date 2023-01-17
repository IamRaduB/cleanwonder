import { UserRole } from './user-role';
import { EmailState } from './email-state';
import { genSalt, hash } from 'bcryptjs';
import { BeforeCreate, Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Practitioner } from '../../practitioner/models/practitioner';
import { Patient } from '../../patient/models/patient';

@Entity()
export class User {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({
    unique: true,
  })
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @ManyToOne(() => UserRole)
  role!: UserRole;

  @ManyToOne(() => EmailState)
  emailState!: EmailState;

  @OneToOne(() => Practitioner, (practitioner) => practitioner.user)
  practitioner: Practitioner;

  @OneToOne(() => Patient, (patient) => patient.user)
  patient: Patient;

  @BeforeCreate()
  async hashPassword() {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }
}
