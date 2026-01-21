import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../../handlers/Socket';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      console.log('Connected', socket.id);
    });

    // Listen for incoming messages
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]); // update state → triggers re-render
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
