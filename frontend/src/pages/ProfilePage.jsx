import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PostCard from '../components/posts/PostCard';
import ProfileHeader from '../components/profile/ProfileHeader';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`https://sumithra-social-media-app-2.onrender.com/users/${id}`);
        setProfileData(data);
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  // Fetch user posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const { data } = await axios.get(`https://sumithra-social-media-app-2.onrender.com/posts/user/${id}?page=${page}`);
        
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...data.posts]);
        }
        
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error('Failed to load posts');
      } finally {
        setIsLoadingPosts(false);
        setIsLoadingMore(false);
      }
    };

    if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [id, activeTab, page]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <FaSpinner className="animate-spin text-primary-500 text-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileHeader 
        profile={profileData} 
        isCurrentUser={user?._id === id} 
      />
      
      <div className="mt-6">
        <div className="flex border-b border-gray-200 dark:border-dark-600">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'media'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('media')}
          >
            Media
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'likes'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('likes')}
          >
            Likes
          </button>
        </div>
        
        <div className="mt-4">
          {activeTab === 'posts' && (
            <>
              {isLoadingPosts && page === 1 ? (
                <div className="flex justify-center items-center h-40">
                  <FaSpinner className="animate-spin text-primary-500 text-2xl" />
                </div>
              ) : posts.length === 0 ? (
                <motion.div 
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-lg font-medium">No posts yet</p>
                  <p className="mt-1">When posts are shared, they will appear here.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              )}
            </>
          )}
          
          {activeTab === 'media' && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No media posts yet</p>
              <p className="mt-1">When media is shared, it will appear here.</p>
            </div>
          )}
          
          {activeTab === 'likes' && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No liked posts yet</p>
              <p className="mt-1">Posts that {profileData.username} likes will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;