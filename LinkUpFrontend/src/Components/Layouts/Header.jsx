import { useState } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import useThemeStore from '../../Stores/ThemeStore';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode } = useThemeStore();

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">
              LinkUp
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <Link to="/" className={`hover:text-blue-600 font-bold transition-colors ${darkMode ? 'text-white' : 'text-black'}`}>
              Home
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg"
          >
            {menuOpen ? <X className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-black'}`} /> : <Menu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-black'}`} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden flex flex-col mt-2 pb-4 border-t pt-4 border-gray-200 dark:border-gray-700">
            <Link to="/" className={`block hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-black'}`}>Home</Link>
          </div>
        )}
      </div>
    </nav>
  );
}