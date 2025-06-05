import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';
import * as path from 'path';

const entitiesDir = path.join(__dirname, '../entities/**/*.entity.{js,ts}');
console.log('entitiesDir', entitiesDir);

const baseConfig: DataSourceOptions = {
  type: "postgres",
  entities: [entitiesDir],
}

const developmentConfig: DataSourceOptions = {
  ...baseConfig,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
}

const dataSourceConfig: DataSourceOptions = developmentConfig;
export const dataSource = new DataSource(dataSourceConfig);