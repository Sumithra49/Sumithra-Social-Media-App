import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);

        // Add your auth token if needed here
        const token = localStorage.getItem("authToken"); // example
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get("https://sumithra-social-media-app-2.onrender.com/messages", config);
        setConversations(data);
      } catch (error) {
        toast.error("Failed to load conversations");
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
          <div className="card p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Start chatting with other users to see your conversations here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.user._id}
                to={`/messages/${conversation.user._id}`}
                className="card block hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={conversation.user.profilePicture || "/default-avatar.png"}
                      alt={conversation.user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{conversation.user.username}</h3>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {conversation.lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MessagesPage;
