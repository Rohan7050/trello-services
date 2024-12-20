import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/userEntity';
import {config} from 'dotenv';
import path from 'path';
import { AccessTypeEntity } from '../entities/accessTypeEntity';
import { CardEntity } from '../entities/cardEntity';
import { ProjectEntity } from '../entities/projectEntity';
import { TableEntity } from '../entities/tableEntity';
import { UserProjectRelEntity } from '../entities/userProjectRelEntity';
const parentDir = path.resolve(__dirname, '../..');

const env = process.env.NODE_ENV || 'development';
config({
  path: `${parentDir}\\.env.${env}`
});

export const pgConnection = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number.isNaN(process.env.DB_PORT) ? 5432 : Number(process.env.DB_PORT),
  username: process.env.DB_HOST_USER,
  password: process.env.DB_HOST_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    UserEntity,
    ProjectEntity,
    AccessTypeEntity,
    UserProjectRelEntity,
    TableEntity,
    CardEntity
  ],
  synchronize: true,
  logging: false,
});
