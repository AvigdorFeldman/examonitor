import { createContext, useContext, useMemo, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const socketUrl = import.meta.env.VITE_API_BASE ?? '';
    console.log(socketUrl);
    return io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket']
    });
  }, []);

  useEffect(() => {
    socket.on('connect', () => console.log('Connected', socket.id));
    return () => socket.disconnect();
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
