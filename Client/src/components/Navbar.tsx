import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isTransparent = isHome;

  return (
    <nav className={`fixed top-0 w-full z-50 ${
      isTransparent 
        ? 'opacity-90 bg-gray-900/95' 
        : 'bg-gray-900/95 backdrop-blur-sm border-b border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">
              TravelAI
            </span>
          </Link>

          <div className="md:flex items-center space-x-4 md:space-x-8">
            <Link 
              to="/explore" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/register'}
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </motion.button> */}
          </div>

          {/* <div className="md:hidden">
            <button className="text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div> */}
        </div>
      </div>
    </nav>
  );
};