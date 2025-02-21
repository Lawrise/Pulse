import dotenv from "dotenv";
import path from "path";
import { Sequelize } from "sequelize";

const envPath = path.resolve(__dirname, "../../../.env");
dotenv.config({ path: envPath });

const dbHost =
  process.env.NODE_ENV === "docker"
    ? process.env.DB_HOST_DOCKER
    : process.env.DB_HOST;

export const sequelize = new Sequelize({
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  host: dbHost!,
  dialect: "postgres",
  logging: false,
});

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

export default sequelize;
