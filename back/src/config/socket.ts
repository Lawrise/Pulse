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
    const userId = socket.handshake.auth.userId;
    
    socket.on("join_chat", (chatId) => {
      const roomName = `chat_${chatId}`;
      socket.join(roomName);
      console.log(`User ${userId} joined chat room: ${roomName}`);
    });

    socket.on("send_message", (message) => {
      const roomName = `chat_${message.chat_id}`;
      // Broadcast to all users in the chat room except sender
      socket.to(roomName).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
};