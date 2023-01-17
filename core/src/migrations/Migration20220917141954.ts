import { Migration } from '@mikro-orm/migrations';

export class Migration20220917141954 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `practitioner` add `avatar_url` varchar(255) null;');
    this.addSql('alter table `practitioner` modify `bio` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `practitioner` modify `bio` varchar(255) not null;');
    this.addSql('alter table `practitioner` drop `avatar_url`;');
  }
}
