const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const chatsRoutes = require("./routes/chat");
const friendsRoutes = require("./routes/friends");

const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Update CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    io.to(`chat_${data.chatId}`).emit("receive_message", data);
  });

  socket.on("join_chat", (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`User joined chat room ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/conv", chatsRoutes);
app.use("/friend", friendsRoutes);

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
