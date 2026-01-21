// index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import app from './app.js'; // your existing Express app

// Create HTTP server
const httpServer = http.createServer(app);

// Allowed origin prefix for CORS
const allowedOriginPrefix = 'https://examonitor-t11n';

// Express CORS (for REST endpoints)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith(allowedOriginPrefix)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.startsWith(allowedOriginPrefix)) {
        callback(null, true);
      } else {
        callback(new Error('Socket not allowed by CORS'));
      }
    },
    credentials: true,
  },
  // transports: ['websocket'], // optional: allow polling fallback if needed
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  // Join rooms
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // Send messages to a room
  socket.on('send_message', ({ room, message }) => {
    if (!room || !message) return;

    // Broadcast message to all clients in the room
    io.to(room).emit('new_message', message);
    console.log(`Message sent to room ${room}:`, message);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', socket.id, reason);
  });
});

// Production-ready port
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
