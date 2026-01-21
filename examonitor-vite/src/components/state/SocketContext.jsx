import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketUrl = import.meta.env.VITE_API_BASE ?? '';

  // Memoize socket to avoid re-creating
  const socket = useMemo(() => io(socketUrl, {
    withCredentials: true,
    autoConnect: true,
    transports: ['polling', 'websocket'], // ensures fallback works
  }), [socketUrl]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected:', reason);
    });

    // Clean up on unmount (optional)
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
