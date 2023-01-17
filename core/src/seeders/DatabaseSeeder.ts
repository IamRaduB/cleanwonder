import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserRole, UserRoles } from '../user/models/user-role';
import { EmailState, EmailStates } from '../user/models/email-state';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(UserRole, {
      name: UserRoles.PRACTITIONER,
    });
    em.create(UserRole, {
      name: UserRoles.PATIENT,
    });

    em.create(EmailState, {
      state: EmailStates.PENDING,
    });
    em.create(EmailState, {
      state: EmailStates.VALIDATED,
    });
    em.create(EmailState, {
      state: EmailStates.COMPLETED,
    });
  }
}
