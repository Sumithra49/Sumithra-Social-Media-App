import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import PostCard from '../components/posts/PostCard';
import AuthContext from '../context/AuthContext';

const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch post details
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`http://localhost:5000/posts/${id}`);
        setPost(data);
        
        // Fetch comments
        const commentsResponse = await axios.get(`http://localhost:5000/comments/${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        toast.error('Failed to load post details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  // Handle new comment
  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  // Handle comment deletion
  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <FaSpinner className="animate-spin text-primary-500 text-2xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Post not found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The post you're looking for might have been deleted or doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          <FaArrowLeft className="mr-2" />
          <span>Back to Feed</span>
        </Link>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PostCard 
          post={post} 
          onDelete={() => {
            toast.success('Post deleted successfully');
            setTimeout(() => {
              window.history.back();
            }, 1500);
          }} 
        />
        
        <div className="card mt-4 p-4">
          <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
          
          <CommentForm 
            postId={post._id}
            onCommentAdded={handleCommentAdded}
          />
          
          <CommentList 
            comments={comments}
            currentUserId={user?._id}
            onCommentDeleted={handleCommentDeleted}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PostDetailPage;