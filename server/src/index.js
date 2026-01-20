import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);

// Prefix שמתקבל לכל דומיין שמתחיל ב־https://examonitor-t11n
const allowedOriginPrefix = 'https://examonitor-t11n';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith(allowedOriginPrefix)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.startsWith(allowedOriginPrefix)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);
});

httpServer.listen(5000, () => console.log('Server running on port 5000'));
