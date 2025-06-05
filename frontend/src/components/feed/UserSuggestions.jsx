import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';

const UserSuggestions = ({ onFollow }) => {
  const { user } = useContext(AuthContext);
  const { sendNotification } = useContext(SocketContext);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('https://sumithra-social-media-app-2.onrender.com/users/suggestions');
        setSuggestions(data);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = async (userId, username) => {
    try {
      setFollowingStatus(prev => ({ ...prev, [userId]: 'loading' }));
      await axios.put(`https://sumithra-social-media-app-2.onrender.com/users/${userId}/follow`);
      
      setFollowingStatus(prev => ({ ...prev, [userId]: 'followed' }));
      toast.success(`You are now following ${username}`);
      
      // Remove from suggestions
      setSuggestions(suggestions.filter(user => user._id !== userId));
      
      // Send notification to followed user
      sendNotification(
        userId, 
        'follow',
        `${user.username} started following you`
      );
      
      if (onFollow) onFollow(userId);
    } catch (error) {
      setFollowingStatus(prev => ({ ...prev, [userId]: 'error' }));
      toast.error(error.response?.data?.message || 'Failed to follow user');
    }
  };

  if (isLoading) {
    return (
      <div className="card p-4">
        <h3 className="font-semibold mb-4">Suggested for you</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-500"></div>
              <div className="flex-grow">
                <div className="h-4 bg-gray-200 dark:bg-dark-500 rounded w-3/4"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 dark:bg-dark-500 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-200 dark:border-dark-600">
        <h3 className="font-semibold">Suggested for you</h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-dark-600">
        {suggestions.map((suggestedUser) => (
          <div key={suggestedUser._id} className="p-4 flex items-center justify-between">
            <Link to={`/profile/${suggestedUser._id}`} className="flex items-center space-x-3">
              <img 
                src={suggestedUser.profilePicture} 
                alt={suggestedUser.username}
                className="w-10 h-10 rounded-full object-cover" 
              />
              <span className="font-medium">{suggestedUser.username}</span>
            </Link>
            
            <motion.button
              onClick={() => handleFollow(suggestedUser._id, suggestedUser.username)}
              className={`text-sm px-3 py-1 rounded-full ${
                followingStatus[suggestedUser._id] === 'followed'
                  ? 'bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-white'
                  : 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
              } transition-colors duration-200`}
              disabled={followingStatus[suggestedUser._id] === 'loading'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {followingStatus[suggestedUser._id] === 'loading' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-500 mx-2"></div>
              ) : followingStatus[suggestedUser._id] === 'followed' ? (
                'Following'
              ) : (
                <div className="flex items-center space-x-1">
                  <FaUserPlus size={12} />
                  <span>Follow</span>
                </div>
              )}
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserSuggestions;