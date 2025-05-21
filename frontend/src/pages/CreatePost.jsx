import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { FaImage, FaPaperPlane, FaTimes, FaVideo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';

const CreatePostForm = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text && !image && !video) {
      toast.error('Please add some content to your post');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data } = await axios.post('/api/posts', {
        text,
        image,
        video
      });
      
      setText('');
      setImage('');
      setVideo('');
      setIsExpanded(false);
      
      toast.success('Post created successfully!');
      
      if (onPostCreated) {
        onPostCreated(data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setText('');
    setImage('');
    setVideo('');
    setIsExpanded(false);
  };

  return (
    <motion.div 
      className="card mb-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex space-x-3">
          <img 
            src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'} 
            alt={user?.username}
            className="w-10 h-10 rounded-full object-cover" 
          />
          <div className="flex-grow">
            <form onSubmit={handleSubmit}>
              <textarea 
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={handleFocus}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-dark-600 dark:text-white resize-none transition-all duration-200"
                rows={isExpanded ? 3 : 1}
              />
              
              {isExpanded && (image || video) && (
                <div className="mt-3 relative">
                  {image && (
                    <div className="relative">
                      <img 
                        src={image} 
                        alt="Post Preview" 
                        className="max-h-60 rounded-md object-cover" 
                      />
                      <button 
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  )}
                  
                  {video && (
                    <div className="relative">
                      <video 
                        src={video} 
                        controls 
                        className="max-h-60 rounded-md w-full" 
                      />
                      <button 
                        type="button"
                        onClick={() => setVideo('')}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {isExpanded && (
                <div className="mt-3">
                  <div className="flex mb-2">
                    <input 
                      type="text" 
                      placeholder="Image URL (optional)"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-gray-50 dark:bg-dark-600 dark:text-white text-sm"
                    />
                    <div className="bg-gray-100 dark:bg-dark-500 border border-gray-300 dark:border-dark-500 border-l-0 rounded-r-md px-3 flex items-center">
                      <FaImage className="text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Video URL (optional)"
                      value={video}
                      onChange={(e) => setVideo(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-gray-50 dark:bg-dark-600 dark:text-white text-sm"
                    />
                    <div className="bg-gray-100 dark:bg-dark-500 border border-gray-300 dark:border-dark-500 border-l-0 rounded-r-md px-3 flex items-center">
                      <FaVideo className="text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
              
              {isExpanded && (
                <div className="mt-4 flex justify-between">
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  
                  <motion.button 
                    type="submit"
                    className="btn btn-primary flex items-center space-x-1"
                    disabled={isSubmitting || (!text && !image && !video)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FaPaperPlane />
                    <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                  </motion.button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePostForm;