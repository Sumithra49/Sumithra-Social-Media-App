import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-700 shadow-inner transition-colors duration-200 mt-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                S
              </div>
              <span className="text-md font-bold text-primary-500">Sumithra Social Media App</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Connect, Share, Experience
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <Link 
              to="/about" 
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              to="/privacy" 
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
            >
              Terms
            </Link>
            <Link 
              to="/contact" 
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>

          {/* Social Media */}
          <div className="flex space-x-4">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Sumithra Social Media App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;