import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket server
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
      });

      setSocket(newSocket);

      // Join as an authenticated user
      newSocket.emit('userOnline', user._id);

      // Listen for user status updates
      newSocket.on('userStatusUpdate', ({ userId, status }) => {
        setOnlineUsers(prev => {
          const newMap = new Map(prev);
          if (status === 'online') {
            newMap.set(userId, true);
          } else {
            newMap.delete(userId);
          }
          return newMap;
        });
      });

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Send private message via socket
  const sendPrivateMessage = (to, message) => {
    if (socket && user) {
      socket.emit('privateMessage', {
        from: user._id,
        to,
        message,
      });
    }
  };

  // Send notification via socket
  const sendNotification = (to, type, content) => {
    if (socket && user) {
      socket.emit('notification', {
        from: user._id,
        to,
        type,
        content,
      });
    }
  };

  // Check if a user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendPrivateMessage,
        sendNotification,
        isUserOnline,
        onlineUsers: [...onlineUsers.keys()],
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;