import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useRef, useState } from 'react';
import { FaComment, FaEdit, FaEllipsisH, FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { formatDistanceToNow } from '../../utils/dateUtils';

const PostCard = ({ post, onDelete, onLike }) => {
  const { user } = useContext(AuthContext);
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isHovered, setIsHovered] = useState(false);
  const optionsRef = useRef(null);

  // Handle clicks outside options menu to close it
  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  // Toggle like on post
  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.put(`http://localhost:5000/posts/${post._id}/unlike`);
        setLikesCount(likesCount - 1);
      } else {
        await axios.put(`http://localhost:5000/posts/${post._id}/like`);
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
      if (onLike) onLike(post._id, !isLiked);
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  // Delete post
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/posts/${post._id}`);
      toast.success('Post deleted successfully');
      if (onDelete) onDelete(post._id);
      setShowConfirmDelete(false);
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <motion.div 
      className="card mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-dark-600">
        <Link to={`/profile/${post.user._id}`} className="flex items-center space-x-3">
          <img 
            src={post.user.profilePicture} 
            alt={post.user.username}
            className="w-10 h-10 rounded-full object-cover" 
          />
          <div>
            <h3 className="font-medium">{post.user.username}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt))}
            </p>
          </div>
        </Link>
        
        {/* Options Menu (only for post owner) */}
        {user?._id === post.user._id && (
          <div className="relative" ref={optionsRef}>
            <button 
              onClick={() => setShowOptions(!showOptions)} 
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              <FaEllipsisH />
            </button>
            
            {showOptions && (
              <motion.div 
                className="absolute right-0 mt-1 w-40 bg-white dark:bg-dark-600 rounded shadow-lg z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => document.addEventListener('mousedown', handleClickOutside, { once: true })}
              >
                <Link 
                  to={`/post/edit/${post._id}`} 
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit Post
                </Link>
                <button 
                  onClick={() => setShowConfirmDelete(true)} 
                  className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete Post
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      {/* Post Content */}
      <Link to={`/post/${post._id}`} className="block">
        <div className="p-4">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{post.text}</p>
          
          {/* Post Image (if any) */}
          {post.image && (
            <div className="mt-3">
              <img 
                src={post.image} 
                alt="Post"
                className="rounded-md max-h-96 w-full object-cover" 
              />
            </div>
          )}
          
          {/* Post Video (if any) */}
          {post.video && (
            <div className="mt-3">
              <video 
                src={post.video} 
                controls
                className="rounded-md max-h-96 w-full object-cover" 
              />
            </div>
          )}
        </div>
      </Link>
      
      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-600 flex items-center space-x-4">
        <button 
          onClick={handleLike}
          className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
        >
          <motion.div whileTap={{ scale: 1.2 }}>
            {isLiked ? (
              <FaHeart className="text-error-500" />
            ) : (
              <FaRegHeart />
            )}
          </motion.div>
          <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>
        
        <Link 
          to={`/post/${post._id}`}
          className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
        >
          <FaComment />
          <span>{post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}</span>
        </Link>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white dark:bg-dark-700 rounded-lg p-6 max-w-sm mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Delete Post?</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              This action cannot be undone. Are you sure you want to delete this post?
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmDelete(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;