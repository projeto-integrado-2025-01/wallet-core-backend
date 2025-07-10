import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';
import * as path from 'path';

const entitiesDir = path.join(__dirname, '../entities/**/*.entity.{js,ts}');

const baseConfig: DataSourceOptions = {
  type: "postgres",
  entities: [entitiesDir],
}

const developmentConfig: DataSourceOptions = {
  ...baseConfig,
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "wallet-core",
  synchronize: true,
  logging: false,
}

const dataSourceConfig: DataSourceOptions = developmentConfig;
export const dataSource = new DataSource(dataSourceConfig);