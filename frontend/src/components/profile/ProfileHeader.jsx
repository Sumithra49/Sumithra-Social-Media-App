import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { FaCheck, FaEdit, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';

const ProfileHeader = ({ profile, isCurrentUser, onFollowChange }) => {
  const { user } = useContext(AuthContext);
  const { isUserOnline, sendNotification } = useContext(SocketContext);
  const [isFollowing, setIsFollowing] = useState(
    profile?.followers?.includes(user?._id)
  );
  const [followerCount, setFollowerCount] = useState(
    profile?.followers?.length || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      if (isFollowing) {
        await axios.put(`https://sumithra-social-media-app-2.onrender.com/users/${profile._id}/unfollow`);
        setFollowerCount(followerCount - 1);
        toast.success(`Unfollowed ${profile.username}`);
      } else {
        await axios.put(`https://sumithra-social-media-app-2.onrender.com/users/${profile._id}/follow`);
        setFollowerCount(followerCount + 1);
        toast.success(`Now following ${profile.username}`);
        
        // Send notification to followed user
        sendNotification(
          profile._id, 
          'follow',
          `${user.username} started following you`
        );
      }
      
      setIsFollowing(!isFollowing);
      
      if (onFollowChange) {
        onFollowChange(!isFollowing);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 sm:h-48 md:h-64 bg-gradient-to-r from-primary-500 to-accent-500 relative"></div>
      
      {/* Profile Info */}
      <div className="px-4 py-4 sm:px-6 md:px-8 relative">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-6 border-4 border-white dark:border-dark-700 rounded-full overflow-hidden shadow-lg">
          <motion.img 
            src={profile?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'} 
            alt={profile?.username}
            className="w-24 h-24 object-cover"
            whileHover={{ scale: 1.05 }}
          />
          {isUserOnline && isUserOnline(profile?._id) && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-dark-700"></div>
          )}
        </div>
        
        {/* Profile Actions */}
        <div className="flex justify-end mb-12">
          {isCurrentUser ? (
            <Link 
              to="/profile/edit" 
              className="btn btn-secondary flex items-center space-x-1"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </Link>
          ) : (
            <motion.button 
              onClick={handleFollowToggle}
              className={`btn flex items-center space-x-1 ${
                isFollowing ? 'btn-secondary' : 'btn-primary'
              }`}
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"></div>
              ) : isFollowing ? (
                <>
                  <FaUserMinus />
                  <span>Unfollow</span>
                </>
              ) : (
                <>
                  <FaUserPlus />
                  <span>Follow</span>
                </>
              )}
            </motion.button>
          )}
        </div>
        
        {/* User Info */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold flex items-center">
            {profile?.username}
            {profile?.verified && (
              <FaCheck className="ml-2 text-primary-500" title="Verified Account" />
            )}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
            {profile?.bio || 'No bio yet.'}
          </p>
          
          <div className="flex mt-4 space-x-4 text-sm">
            <div>
              <span className="font-bold">{profile?.following?.length || 0}</span>
              <span className="text-gray-600 dark:text-gray-400"> Following</span>
            </div>
            <div>
              <span className="font-bold">{followerCount}</span>
              <span className="text-gray-600 dark:text-gray-400"> Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;