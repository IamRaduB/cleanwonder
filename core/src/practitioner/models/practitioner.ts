import { User } from '../../user/models/user';
import { Clinic } from '../../clinic/models/clinic';
import { Collection, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Patient } from '../../patient/models/patient';

@Entity()
export class Practitioner {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  title: string;

  @Property({
    type: 'mediumtext',
    nullable: true,
  })
  bio?: string;

  @Property({
    nullable: true,
  })
  avatarUrl?: string;

  @OneToOne(() => User, (user) => user.practitioner, { owner: true, orphanRemoval: true })
  user!: User;

  @ManyToOne(() => Clinic)
  clinic!: Clinic;

  @OneToMany(() => Patient, (patient) => patient.practitioner)
  patients = new Collection<Patient>(this);
}
