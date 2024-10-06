import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const CHAT_EVENT = "chat message";

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on(CHAT_EVENT, (msg) => {
    if (msg.username && msg.text) {
      io.emit(CHAT_EVENT, {
        username: msg.username.slice(0, 50), // Limit username length
        text: msg.text.slice(0, 500), // Limit message length
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});