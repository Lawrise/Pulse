"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const core_1 = require("@sequelize/core");
const postgres_1 = require("@sequelize/postgres");
const nmodels_1 = require("../nmodels");
const envPath = path_1.default.resolve(__dirname, "../../../.env");
dotenv_1.default.config({ path: envPath });
const dbHost = process.env.NODE_ENV === "docker"
    ? process.env.DB_HOST_DOCKER
    : process.env.DB_HOST;
// orm squelize
const sequelize = new core_1.Sequelize({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: dbHost,
    dialect: postgres_1.PostgresDialect,
    logging: false,
    models: [nmodels_1.User, nmodels_1.Friend, nmodels_1.Chat, nmodels_1.Message],
});
exports.sequelize = sequelize;
sequelize
    .authenticate()
    .then(() => console.log("✅ Sequelize connected successfully!"))
    .catch((error) => console.error("❌ Sequelize connection error:", error));
