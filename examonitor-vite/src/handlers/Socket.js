import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_BASE ?? '';

export const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false,         
  transports: ['websocket'],
});
