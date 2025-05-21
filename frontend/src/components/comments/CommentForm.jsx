import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';

const CommentForm = ({ postId, onCommentAdded }) => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data } = await axios.post('http://localhost:5000/comments', {
        postId,
        text
      });
      
      setText('');
      toast.success('Comment added successfully!');
      
      if (onCommentAdded) {
        onCommentAdded(data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <img 
          src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'} 
          alt={user?.username}
          className="w-8 h-8 rounded-full object-cover" 
        />
        <div className="flex-grow relative">
          <input 
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-dark-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-dark-600 dark:text-white"
          />
          <motion.button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-500 disabled:text-gray-400"
            disabled={!text.trim() || isSubmitting}
            whileTap={{ scale: 0.9 }}
          >
            <FaPaperPlane />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;