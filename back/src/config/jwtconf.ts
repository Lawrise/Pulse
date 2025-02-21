import { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

console.log("JWT_SECRET:", process.env.JWT_SECRET); // Changed from DB_NAME to JWT_SECRET

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const JWT_SECRET: Secret = process.env.JWT_SECRET;
