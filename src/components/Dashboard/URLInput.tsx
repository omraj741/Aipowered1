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
    await generateTests(url);
  };

  const generateTests = async (targetUrl: string) => {
    if (!targetUrl) return;
    // normalize URL
    let normalized = targetUrl.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    setUrl(normalized);
    setIsLoading(true);
    try {
      window.dispatchEvent(new CustomEvent('test-generation:started'));
      const token = localStorage.getItem('jwt');
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/tests/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ url: normalized })
      });
      const data = await resp.json();
      const event = new CustomEvent('test-generation:completed', { detail: data });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Generation error', err);
      const event = new CustomEvent('test-generation:completed', { detail: { success: false, message: 'Failed to generate' } });
      window.dispatchEvent(event);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData?.getData('text')?.trim();
    if (!pasted) return;
    // if user is not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // prevent the default paste so we control normalization
    e.preventDefault();
    await generateTests(pasted);
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
            onPaste={handlePaste}
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