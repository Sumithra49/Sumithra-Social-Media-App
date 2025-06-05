import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]); // { _id, name, avatar } for each user
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch the array of user IDs of conversation partners
        const { data: userIds } = await axios.get('https://sumithra-social-media-app-2.onrender.com/messages');

        // 2. Fetch user details for each userId in parallel
        const userDetailsPromises = userIds.map(id =>
          axios.get(`https://sumithra-social-media-app-2.onrender.com/users/${id}`).then(res => res.data)
        );
        const users = await Promise.all(userDetailsPromises);

        setConversations(users);
      } catch (error) {
        toast.error('Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6">Messages</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <FaSpinner className="animate-spin text-primary-500 text-2xl" />
          </div>
        ) : conversations.length === 0 ? (
          <p>No conversations yet. Start a new chat!</p>
        ) : (
          <ul>
            {conversations.map(user => (
              <li key={user._id} className="mb-4 p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <Link to={`http://localhost:5000/messages/${user._id}`} className="flex items-center space-x-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300">
                      {user.name[0]}
                    </div>
                  )}
                  <span className="font-medium">{user.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default MessagesPage;
