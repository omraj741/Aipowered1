import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userMenuAnimation } from '../../utils/animations';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
          {user.name}
        </span>
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
          />
          <motion.div
            initial={false}
            animate={isOpen ? "visible" : "hidden"}
            variants={{
              visible: { scale: 1.1 },
              hidden: { scale: 1 }
            }}
            className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"
          ></motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 z-10"
            variants={userMenuAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
            <div className="py-1">
              <a 
                href="#profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => { e.preventDefault(); setIsOpen(false); }}
              >
                <User size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                Profile
              </a>
              <a 
                href="#settings" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => { e.preventDefault(); setIsOpen(false); }}
              >
                <Settings size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                Settings
              </a>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <a 
                href="#logout" 
                className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => { 
                  e.preventDefault(); 
                  logout(); 
                  setIsOpen(false);
                }}
              >
                <LogOut size={16} className="mr-3 text-red-500 dark:text-red-400" />
                Logout
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;