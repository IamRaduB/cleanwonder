import { Migration } from '@mikro-orm/migrations';

export class Migration20220917214754 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `patient` (`id` int unsigned not null auto_increment primary key, `first_name` varchar(255) not null, `last_name` varchar(255) not null, `birth_date` date not null, `ssn` varchar(255) not null, `address_line1` varchar(255) not null, `address_line2` varchar(255) null, `phone_number` varchar(255) not null, `details` mediumtext null, `user_id` int unsigned not null, `practitioner_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql('alter table `patient` add unique `patient_ssn_unique`(`ssn`);');
    this.addSql('alter table `patient` add unique `patient_user_id_unique`(`user_id`);');
    this.addSql('alter table `patient` add index `patient_practitioner_id_index`(`practitioner_id`);');

    this.addSql(
      'alter table `patient` add constraint `patient_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;',
    );
    this.addSql(
      'alter table `patient` add constraint `patient_practitioner_id_foreign` foreign key (`practitioner_id`) references `practitioner` (`id`) on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `patient`;');
  }
}
