import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Play } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const URLInput: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const handleInputFocus = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!url) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onClick={handleInputClick}
            onFocus={handleInputFocus}
            placeholder="Paste Web App URL"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <Button
          type="submit"
          isLoading={isLoading}
          icon={<Play size={16} />}
          className="whitespace-nowrap"
        >
          Run Test
        </Button>
      </form>
    </motion.div>
  );
};

export default URLInput;