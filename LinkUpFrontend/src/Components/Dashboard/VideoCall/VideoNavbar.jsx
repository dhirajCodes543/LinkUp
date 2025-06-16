


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, LogOut, Moon, Sun } from "lucide-react";
import useThemeStore from "../../../Stores/ThemeStore";
import { useNavigate } from "react-router-dom";

const VideoNavbar = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => navigate('/logout'); 

  if (!isLoggedIn) return null;

  return (
    <nav
      className={`w-full border-b py-3 px-4 transition-colors ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-white  border-gray-200 text-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Home */}
        <Link
          to="/"
          className="flex items-center gap-1.5 hover:opacity-80 transition-transform transform hover:scale-[1.03]"
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:block text-base font-medium">Home</span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className={`flex items-center gap-1.5 p-1.5 rounded-md transition
              transform hover:scale-105 ${
                darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
              }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="hidden sm:block text-base font-medium">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className={`flex items-center gap-1.5 p-1.5 rounded-md transition
              transform hover:scale-105 ${
                darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
              }`}
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:block text-base font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default VideoNavbar;
