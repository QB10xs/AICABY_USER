import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Car } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  return (
    <nav className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/welcome" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-xl inline-flex">
                <Car className="w-5 h-5 text-black" />
              </div>
              <span className="text-primary font-bold text-xl">AiCabY</span>
            </Link>
          </div>

          {/* Right side - Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/driver" 
              className="text-zinc-400 hover:text-white transition-colors px-3 py-2"
            >
              Drive with Us
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
            <Link 
              to="/signin" 
              className="text-zinc-400 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-primary text-black font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Book a Ride Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
