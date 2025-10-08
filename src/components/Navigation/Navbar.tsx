import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import UserMenu from './UserMenu';
import ThemeToggle from '../ui/ThemeToggle';
import { slideDown } from '../../utils/animations';

const Navbar: React.FC = () => {
  return (
    <motion.nav 
      className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10"
      initial="hidden"
      animate="visible"
      variants={slideDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Terminal className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                AutoTest <span className="text-primary-500">AI</span>
              </span>
            </motion.div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a 
                href="#dashboard" 
                className="border-primary-500 text-primary-600 dark:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </a>
              <a 
                href="#tests" 
                className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Tests
              </a>
              <a 
                href="#healing" 
                className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Healing
              </a>
              <a 
                href="#analytics" 
                className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Analytics
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;