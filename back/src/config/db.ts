import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { User, Friend, Chat, Message } from "../nmodels";

const envPath = path.resolve(__dirname, "../../../.env");
dotenv.config({ path: envPath });

const dbHost =
  process.env.NODE_ENV === "docker"
    ? process.env.DB_HOST_DOCKER
    : process.env.DB_HOST;

// orm squelize
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: dbHost,
  dialect: PostgresDialect,
  logging: false,
  models: [User, Friend, Chat, Message],
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Sequelize connected successfully!"))
  .catch((error) => console.error("❌ Sequelize connection error:", error));

export { sequelize };
