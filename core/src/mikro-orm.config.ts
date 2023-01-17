import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';

export default {
  driver: MySqlDriver,
  driverOptions: {
    connection: {
      socketPath: process.env.NODE_ENV === 'production' ? process.env.INSTANCE_UNIX_SOCKET : undefined,
    },
  },
  entities: ['./dist/**/models/*.js'],
  entitiesTs: ['./src/**/models/*.ts'],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
    disableForeignKeys: true,
    emit: 'ts',
  },
  seeder: {
    path: './dist/seeders',
    pathTs: './src/seeders',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    defaultSeeder: 'DatabaseSeeder',
  },
} as Options;
