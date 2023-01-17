import { Migration } from '@mikro-orm/migrations';

export class Migration20220817165919 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `clinic` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `vat_id` varchar(255) not null, `logo_url` varchar(255) null, `address_line1` varchar(255) not null, `address_line2` varchar(255) null, `description` varchar(255) null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql('alter table `clinic` add unique `clinic_vat_id_unique`(`vat_id`);');

    this.addSql(
      'create table `practitioner` (`id` int unsigned not null auto_increment primary key, `first_name` varchar(255) not null, `last_name` varchar(255) not null, `title` varchar(255) not null, `bio` varchar(255) not null, `user_id` int unsigned not null, `clinic_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql('alter table `practitioner` add unique `practitioner_user_id_unique`(`user_id`);');
    this.addSql('alter table `practitioner` add index `practitioner_clinic_id_index`(`clinic_id`);');

    this.addSql(
      'alter table `practitioner` add constraint `practitioner_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;',
    );
    this.addSql(
      'alter table `practitioner` add constraint `practitioner_clinic_id_foreign` foreign key (`clinic_id`) references `clinic` (`id`) on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `practitioner` drop foreign key `practitioner_clinic_id_foreign`;');

    this.addSql('drop table if exists `clinic`;');

    this.addSql('drop table if exists `practitioner`;');
  }
}
