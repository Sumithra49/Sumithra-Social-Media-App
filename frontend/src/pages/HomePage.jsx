import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import UserSuggestions from '../components/feed/UserSuggestions';
import CreatePostForm from '../components/posts/CreatePostForm';
import PostCard from '../components/posts/PostCard';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch posts for feed
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`http://localhost:5000/posts?page=${page}`);
        
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...data.posts]);
        }
        
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error('Failed to load posts');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchPosts();
  }, [page]);

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Handle post deletion
  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  // Load more posts
  const handleLoadMore = () => {
    if (page < totalPages && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(page + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="md:flex md:space-x-6">
        {/* Main Feed */}
        <div className="md:w-8/12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CreatePostForm onPostCreated={handlePostCreated} />
          </motion.div>

          {isLoading && page === 1 ? (
            <div className="flex justify-center items-center h-60">
              <FaSpinner className="animate-spin text-primary-500 text-2xl" />
            </div>
          ) : posts.length === 0 ? (
            <div className="card p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Welcome to your feed!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your feed is empty. Start by creating your first post or following users to see their posts here.
              </p>
            </div>
          ) : (
            <div>
              {posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onDelete={handlePostDeleted} 
                />
              ))}
              
              {page < totalPages && (
                <div className="flex justify-center mt-6 mb-4">
                  <button 
                    onClick={handleLoadMore}
                    className="btn btn-secondary flex items-center space-x-2"
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Loading</span>
                      </>
                    ) : (
                      <span>Load More</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <aside className="md:w-4/12 mt-6 md:mt-0 space-y-6">
          <UserSuggestions />
          
          {/* User Profile Card */}
          <div className="card p-4">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'} 
                alt={user?.username}
                className="w-12 h-12 rounded-full object-cover" 
              />
              <div>
                <h3 className="font-semibold">{user?.username}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div className="flex justify-between mb-1">
                <span>Posts</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">0</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Following</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{user?.following?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Followers</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{user?.followers?.length || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Trending Topics */}
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Trending Topics</h3>
            <div className="space-y-2">
              <div className="text-sm hover:bg-gray-100 dark:hover:bg-dark-600 rounded p-2 transition-colors duration-150 cursor-pointer">
                <div className="font-medium">#WebDevelopment</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">1.2K posts</div>
              </div>
              <div className="text-sm hover:bg-gray-100 dark:hover:bg-dark-600 rounded p-2 transition-colors duration-150 cursor-pointer">
                <div className="font-medium">#ReactJS</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">856 posts</div>
              </div>
              <div className="text-sm hover:bg-gray-100 dark:hover:bg-dark-600 rounded p-2 transition-colors duration-150 cursor-pointer">
                <div className="font-medium">#JavaScript</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">743 posts</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;