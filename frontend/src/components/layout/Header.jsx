import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaBell, FaEnvelope, FaMoon, FaSearch, FaSignOutAlt, FaSun, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import NotificationContext from '../../context/NotificationContext';
import ThemeContext from '../../context/ThemeContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { unreadCount, notifications, markAsRead } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle clicks outside menus to close them
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results
      navigate(`/explore?search=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markAsRead();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-dark-700 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              S
            </motion.div>
            <span className="text-xl font-bold text-primary-500">Sumithra Social Media </span>
          </Link>

          {/* Search Bar - visible only if authenticated */}
          {isAuthenticated && (
            <form 
              onSubmit={handleSearch} 
              className="hidden md:flex relative mx-4 flex-grow max-w-md"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 dark:border-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100 dark:bg-dark-600 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300"
              >
                <FaSearch />
              </button>
            </form>
          )}

          {/* Right Menu */}
          <div className="flex items-center space-x-3">
            {/* Toggle Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>

            {/* Authenticated Links */}
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotifications}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200 relative"
                    aria-label="Notifications"
                  >
                    <FaBell className="text-gray-600 dark:text-gray-300" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-700 rounded-md shadow-lg z-10"
                    >
                      <div className="p-3 border-b border-gray-200 dark:border-dark-600">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification, index) => (
                            <div 
                              key={index} 
                              className="p-3 border-b border-gray-200 dark:border-dark-600 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-150"
                            >
                              <p className="text-sm">{notification.content}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No notifications yet
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Messages */}
                <Link
                  to="/messages"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
                  aria-label="Messages"
                >
                  <FaEnvelope className="text-gray-600 dark:text-gray-300" />
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 focus:outline-none"
                    aria-label="User menu"
                  >
                    <img
                      src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-300"
                    />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-md shadow-lg z-10"
                    >
                      <div className="p-3 border-b border-gray-200 dark:border-dark-600">
                        <p className="font-semibold">{user?.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={`/profile/${user?._id}`}
                          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-150"
                        >
                          <FaUser className="mr-2" /> Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-150 text-error-600"
                        >
                          <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;