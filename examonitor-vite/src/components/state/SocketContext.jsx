export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const socketUrl = import.meta.env.VITE_API_BASE;
    return io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      transports: import.meta.env.DEV
        ? ['polling', 'websocket']
        : ['websocket']
    });
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to Chat Server:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Connection Error:', err.message);
    });

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
