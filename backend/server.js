import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

//  configure Socket.io
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Allow frontend
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

//  Maintain connected clients list
const connectedClients = new Map(); // {socket.id: email}

//  Socket.io Connection
io.on("connection", (socket) => {
  console.log("📡 New client connected:", socket.id);

  //  Track connected client
  socket.on("register", (email) => {
    connectedClients.set(socket.id, email);
    console.log(` Registered client: ${email}`);
  });

  //  Handle incoming chat messages
  socket.on("chatMessage", (msg) => {
    console.log(" Message received:", msg);

    // Broadcast message to all connected clients
    io.emit("message", msg);

    //  Auto-reply if user sends "hi"
    if (msg.toLowerCase() === "hi") {
      setTimeout(() => {
        io.emit("message", "🤖 Bot: Hello! How can I assist you today?");
      }, 500);
    }
  });

  //  Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    connectedClients.delete(socket.id);
  });
});

//  MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//  Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
