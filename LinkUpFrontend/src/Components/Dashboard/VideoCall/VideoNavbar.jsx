import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, LogOut, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../Stores/ThemeStore';

const VideoNavbar = () => {
  const { darkMode,toggleDarkMode }= useThemeStore();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Update dark mode class on root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    // Add actual logout logic here
    setIsLoggedIn(false);
    // You might want to redirect here
    // window.location.href = '/login';
  };

  if (!isLoggedIn) return null;

  return (
    <nav className={`w-full py-3 px-4 border-b transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 border-gray-700 text-gray-100' 
        : 'bg-white border-gray-200 text-gray-700'
    }`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left Side - Home Link */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link
            to="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:block text-base font-medium">Home</span>
          </Link>
        </motion.div>

        {/* Right Side - Controls */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <motion.button
            onClick={() => toggleDarkMode()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`flex items-center gap-1.5 p-1.5 rounded-md transition-colors ${
              darkMode
                ? 'hover:bg-gray-700/50'
                : 'hover:bg-gray-100'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="hidden sm:block text-base font-medium">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </motion.button>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`flex items-center gap-1.5 p-1.5 rounded-md transition-colors ${
              darkMode
                ? 'hover:bg-gray-700/50'
                : 'hover:bg-gray-100'
            }`}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:block text-base font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default VideoNavbar;