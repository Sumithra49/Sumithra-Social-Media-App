import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthContext from './AuthContext';
import SocketContext from './SocketContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  // Fetch notifications on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
    }
  }, [isAuthenticated, user]);

  // Listen for new notifications via socket
  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show toast based on notification type
        if (notification.type === 'like') {
          toast.info('Someone liked your post');
        } else if (notification.type === 'comment') {
          toast.info('Someone commented on your post');
        } else if (notification.type === 'follow') {
          toast.info('Someone started following you');
        } else if (notification.type === 'message') {
          toast.info('You received a new message');
        }
      });

      return () => {
        socket.off('newNotification');
      };
    }
  }, [socket]);

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      // This endpoint is not implemented in the API yet
      // For now, we'll use sample data
      /*
      const { data } = await axios.get('/users/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(notif => !notif.read).length);
      */
      
      // Sample data - replace with API call when endpoint is ready
      const sampleNotifications = [];
      setNotifications(sampleNotifications);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notifications as read
  const markAsRead = async () => {
    try {
      // This endpoint is not implemented in the API yet
      // await axios.put('/users/notifications/read');
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;