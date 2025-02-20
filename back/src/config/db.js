const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");
const { Sequelize } = require("sequelize");

const envPath = path.resolve(__dirname, "../../../.env");
dotenv.config({ path: envPath });

const dbHost =
  process.env.NODE_ENV === "docker"
    ? process.env.DB_HOST_DOCKER
    : process.env.DB_HOST;

// requete brute
const pool = new Pool({
  user: process.env.DB_USER,
  host: dbHost,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
});

// orm squelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: dbHost,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = { pool, sequelize };
