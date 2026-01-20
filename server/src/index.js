import 'dotenv/config';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT;

const server = http.createServer(app);

const io = new Server(server, {
  transports: ["websocket"],
  cors: {
    origin: ["https://examonitor-t11n.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('send_message', ({ room, message }) => {
    socket.to(room).emit('new_message', {
      ...message,
      room
    });
  });

  socket.on('new_incident', (incident) => {
    socket.broadcast.emit('new_incident_received', incident);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
