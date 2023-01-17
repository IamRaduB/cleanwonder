import { Practitioner } from '../../practitioner/models/practitioner';
import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Clinic {
  @PrimaryKey({
    autoincrement: true,
  })
  id: number;

  @Property({
    nullable: false,
  })
  name!: string;

  @Property({
    unique: true,
    nullable: false,
  })
  vatId: string;

  @Property({
    nullable: true,
  })
  logoUrl: string;

  @Property({
    nullable: false,
  })
  addressLine1: string;

  @Property({
    nullable: true,
  })
  addressLine2: string;

  @Property({
    nullable: true,
  })
  description: string;

  @OneToMany(() => Practitioner, (practitioner) => practitioner.clinic)
  practitioners = new Collection<Practitioner>(this);
}
