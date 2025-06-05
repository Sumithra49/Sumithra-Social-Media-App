import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import { formatDistanceToNow } from '../../utils/dateUtils';

const ChatBox = ({ recipientId, recipientData }) => {
  const { user } = useContext(AuthContext);
  const { socket, sendPrivateMessage, isUserOnline } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Fetch messages on component mount
  useEffect(() => {
    const getMessages = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`https://sumithra-social-media-app-2.onrender.com/messages/${recipientId}`);
        setMessages(data);
      } catch (error) {
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    if (recipientId) {
      getMessages();
    }
  }, [recipientId]);
  
  // Listen for new messages via socket
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (data) => {
        if (data.from === recipientId) {
          setMessages((prevMessages) => [...prevMessages, {
            sender: { _id: data.from },
            recipient: { _id: user._id },
            text: data.message,
            createdAt: new Date().toISOString(),
          }]);
          
          // Mark message as read
          axios.put(`https://sumithra-social-media-app-2.onrender.com/messages/${recipientId}/read`);
        }
      };
      
      socket.on('newMessage', handleNewMessage);
      
      return () => {
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [socket, recipientId, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      setIsSending(true);
      
      const { data } = await axios.post('http://localhost:5000/messages', {
        recipient: recipientId,
        text: newMessage,
      });
      
      setMessages([...messages, data]);
      setNewMessage('');
      
      // Send message via socket
      sendPrivateMessage(recipientId, newMessage);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="card flex flex-col h-[calc(100vh-200px)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex items-center">
        <Link to="/messages" className="mr-3 md:hidden">
          <FaArrowLeft />
        </Link>
        
        <div className="relative">
          <img 
            src={recipientData?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'} 
            alt={recipientData?.username}
            className="w-10 h-10 rounded-full object-cover" 
          />
          {isUserOnline && isUserOnline(recipientId) && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-dark-700"></span>
          )}
        </div>
        
        <div className="ml-3">
          <h3 className="font-medium">{recipientData?.username}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isUserOnline && isUserOnline(recipientId) ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-primary-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <MessageBubble 
                key={message._id || index}
                message={message}
                isSentByMe={message.sender._id === user?._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-600">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input 
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="form-input rounded-full"
            disabled={isSending}
          />
          <motion.button 
            type="submit"
            className="btn btn-primary rounded-full p-3"
            disabled={!newMessage.trim() || isSending}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <FaPaperPlane />
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, isSentByMe }) => {
  return (
    <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
          isSentByMe 
            ? 'bg-primary-500 text-white rounded-br-none' 
            : 'bg-gray-200 dark:bg-dark-600 rounded-bl-none'
        }`}
      >
        <p>{message.text}</p>
        <p className={`text-xs mt-1 ${
          isSentByMe ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {formatDistanceToNow(new Date(message.createdAt))}
        </p>
      </motion.div>
    </div>
  );
};

export default ChatBox;