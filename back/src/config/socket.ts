import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const configureSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("send_message", (data) => {
      console.log("📨 Message received:", data);
      io.to(`chat_${data.chatId}`).emit("receive_message", data);
    });

    socket.on("join_chat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`👥 User joined chat room ${chatId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected");
    });
  });

  return io;
};