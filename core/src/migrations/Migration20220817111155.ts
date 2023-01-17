import { Migration } from '@mikro-orm/migrations';

export class Migration20220817111155 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `email_state` (`id` int unsigned not null auto_increment primary key, `state` enum('pending', 'validated', 'completed') not null) default character set utf8mb4 engine = InnoDB;",
    );

    this.addSql(
      "create table `user_role` (`id` int unsigned not null auto_increment primary key, `name` enum('practitioner', 'patient') not null) default character set utf8mb4 engine = InnoDB;",
    );

    this.addSql(
      'create table `user` (`id` int unsigned not null auto_increment primary key, `email` varchar(255) not null, `password` varchar(255) not null, `role_id` int unsigned not null, `email_state_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');
    this.addSql('alter table `user` add index `user_role_id_index`(`role_id`);');
    this.addSql('alter table `user` add index `user_email_state_id_index`(`email_state_id`);');

    this.addSql(
      'alter table `user` add constraint `user_role_id_foreign` foreign key (`role_id`) references `user_role` (`id`) on update cascade;',
    );
    this.addSql(
      'alter table `user` add constraint `user_email_state_id_foreign` foreign key (`email_state_id`) references `email_state` (`id`) on update cascade;',
    );
  }
}
