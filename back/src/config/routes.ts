import { Express } from "express";
import authRoutes from "../routes/auth";
import chatsRoutes from "../routes/chat";
import friendsRoutes from "../routes/friends";

export const configureRoutes = (app: Express) => {
  app.use("/auth", authRoutes);
  app.use("/chats", chatsRoutes);
  app.use("/friend", friendsRoutes);
};