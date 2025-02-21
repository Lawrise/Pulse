import express from "express";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { sequelize, initDatabase } from "./config/db";
import { configureSocket } from "./config/socket";
import { configureMiddleware } from "./config/middleware";
import { configureRoutes } from "./config/routes";
import { initializeModels } from "./nmodels";

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const app = express();
const server = http.createServer(app);

// Configure middleware
configureMiddleware(app);

// Configure routes
configureRoutes(app);

// Configure Socket.IO
const io = configureSocket(server);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();


    
    // Initialize models
    initializeModels();

    // Sync database (be careful with force: true in production!)
    await sequelize.sync({
      force: process.env.NODE_ENV === "development",
    });

    // Start server
    server.listen(PORT, () => {
      console.log(`
🚀 Server is running!
📡 PORT: ${PORT}
🌍 ENV: ${process.env.NODE_ENV}
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});

startServer();

export { app, server, io };
