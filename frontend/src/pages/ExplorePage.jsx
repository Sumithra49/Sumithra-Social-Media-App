import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PostCard from '../components/posts/PostCard';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Fetch trending posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`https://sumithra-social-media-app-2.onrender.com/posts/trending?page=${page}`);
        
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

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update URL with search parameter
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
    
    // In a real app, you would fetch search results here
    // This is a placeholder for demonstration
    toast.info(`Search functionality would filter posts by "${searchTerm}"`);
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
    <div className="max-w-4xl mx-auto">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="card p-4">
          <h2 className="text-xl font-bold mb-4">Explore</h2>
          
          <form onSubmit={handleSearch} className="flex mb-4">
            <input
              type="text"
              placeholder="Search posts, topics, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input rounded-l-md rounded-r-none flex-grow"
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <FaSearch />
            </button>
          </form>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button className="px-3 py-1 bg-primary-500 text-white rounded-full text-sm whitespace-nowrap">
              Trending
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-dark-600 rounded-full text-sm whitespace-nowrap">
              Latest
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-dark-600 rounded-full text-sm whitespace-nowrap">
              Photos
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-dark-600 rounded-full text-sm whitespace-nowrap">
              Videos
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-dark-600 rounded-full text-sm whitespace-nowrap">
              #webdev
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-dark-600 rounded-full text-sm whitespace-nowrap">
              #design
            </button>
          </div>
        </div>
      </motion.div>

      {isLoading && page === 1 ? (
        <div className="flex justify-center items-center h-60">
          <FaSpinner className="animate-spin text-primary-500 text-2xl" />
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            There are no posts to display at the moment.
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={handlePostDeleted} 
              />
            ))}
          </div>
          
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
  );
};

export default ExplorePage;