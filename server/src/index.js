import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import app from './app.js'; // your existing Express app

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Allowed origin for your Vercel frontend
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://examonitor-t11n.vercel.app';

// Express CORS for REST endpoints
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  // Join room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // Send message to room (excluding sender to avoid duplicates)
  socket.on('send_message', ({ room, message }) => {
    if (!room || !message) return;
    socket.to(room).emit('new_message', { ...message, room });
  });

  // Example: broadcast new incident to everyone except sender
  socket.on('new_incident', (incident) => {
    console.log('New incident received:', incident);
    socket.broadcast.emit('new_incident_received', incident);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', socket.id, reason);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
