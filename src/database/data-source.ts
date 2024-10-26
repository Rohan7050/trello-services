import { DataSource } from 'typeorm';
import { DB_CONFIGS, DB_ENVIRONMENT } from './database.config';
import { User } from '../entities/userEntity';

export const pgConnection = new DataSource({
  type: "postgres",
  host: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS['DB'].host,
  port: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS['DB'].port,
  username: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS['DB'].user,
  password: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS['DB'].password,
  database: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS['DB'].database,
  entities: [
    User
  ],
  synchronize: false,
  logging: false,
});
