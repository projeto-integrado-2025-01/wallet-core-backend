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
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "wallet_core",
  synchronize: true,
  logging: true,
}

const dataSourceConfig: DataSourceOptions = developmentConfig;
export const dataSource = new DataSource(dataSourceConfig);