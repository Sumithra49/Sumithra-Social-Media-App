import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from '../../utils/dateUtils';

const CommentList = ({ comments, currentUserId, onCommentDeleted }) => {
  const [likedComments, setLikedComments] = useState({});
  const [commentLikesCount, setCommentLikesCount] = useState(
    comments.reduce((acc, comment) => {
      acc[comment._id] = comment.likes.length;
      return acc;
    }, {})
  );

  const isCommentLiked = (comment) => {
    if (likedComments[comment._id] !== undefined) {
      return likedComments[comment._id];
    }
    return comment.likes.includes(currentUserId);
  };

  // Handle like/unlike comment
  const handleLikeComment = async (commentId, isLiked) => {
    try {
      if (isLiked) {
        await axios.put(`http://localhost:5000/comments/${commentId}/unlike`);
        setCommentLikesCount(prev => ({
          ...prev,
          [commentId]: prev[commentId] - 1
        }));
      } else {
        await axios.put(`http://localhost:5000/comments/${commentId}/like`);
        setCommentLikesCount(prev => ({
          ...prev,
          [commentId]: prev[commentId] + 1
        }));
      }
      
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !isLiked
      }));
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/comments/${commentId}`);
      toast.success('Comment deleted successfully');
      
      if (onCommentDeleted) {
        onCommentDeleted(commentId);
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="mt-4 space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {comments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <motion.div 
            key={comment._id} 
            className="flex space-x-3"
            variants={item}
          >
            <Link to={`http://localhost:5000/profile/${comment.user._id}`}>
              <img 
                src={comment.user.profilePicture} 
                alt={comment.user.username}
                className="w-8 h-8 rounded-full object-cover" 
              />
            </Link>
            <div className="flex-grow">
              <div className="bg-gray-100 dark:bg-dark-600 rounded-lg px-4 py-2">
                <Link 
                  to={`/profile/${comment.user._id}`}
                  className="font-medium hover:underline"
                >
                  {comment.user.username}
                </Link>
                <p className="mt-1 text-gray-800 dark:text-gray-200">{comment.text}</p>
              </div>
              
              <div className="flex items-center mt-1 space-x-4 text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt))}
                </span>
                
                <button 
                  onClick={() => handleLikeComment(comment._id, isCommentLiked(comment))}
                  className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {isCommentLiked(comment) ? (
                    <FaHeart className="text-error-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{commentLikesCount[comment._id] || 0} {commentLikesCount[comment._id] === 1 ? 'Like' : 'Likes'}</span>
                </button>
                
                {comment.user._id === currentUserId && (
                  <button 
                    onClick={() => handleDeleteComment(comment._id)}
                    className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-error-500"
                  >
                    <FaTrash size={12} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default CommentList;