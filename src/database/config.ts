import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const database_config: DataSourceOptions =
    process.env.NODE_ENV === "development"
        ? {
              type: "postgres",
              host: DB_HOST,
              port: Number(DB_PORT),
              username: DB_USERNAME,
              password: String(DB_PASSWORD),
              database: DB_NAME,
              entities: ["src/database/entity/**/*.ts"],
              migrations: ["src/database/migration/**/*.ts"],
              subscribers: ["src/database/subscriber/**/*.ts"],
              synchronize: false,
              logging: false,
          }
        : {
              type: "postgres",
              host: DB_HOST,
              port: Number(DB_PORT),
              username: DB_USERNAME,
              password: String(DB_PASSWORD),
              database: DB_NAME,
              entities: ["build/src/database/entity/**/*.js"],
              migrations: ["build/src/database/migration/**/*.js"],
              subscribers: ["build/src/database/subscriber/**/*.js"],
              synchronize: false,
              logging: false,
          };

const AppDataSource = new DataSource(database_config);
export { AppDataSource };
