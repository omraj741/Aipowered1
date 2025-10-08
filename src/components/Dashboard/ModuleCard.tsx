import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import DetailModal from './DetailModal';
import { ModuleCardProps } from '../../types';
import { cn } from '../../utils/cn';

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  icon,
  children,
  className,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };
  return (
    <>
      <Card 
        className={cn('h-full flex flex-col cursor-pointer group', className)}
        onClick={handleCardClick}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="mr-3 text-primary-500 dark:text-primary-400"
            >
              {icon}
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isModalOpen ? 180 : 0 }}
            className="text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
        <div className="p-4 flex-grow">
          {children}
        </div>
      </Card>

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={title.toLowerCase().includes('test') ? 'results' : title.toLowerCase().includes('healing') ? 'healing' : 'flaky'}
        title={title}
      />
    </>
  );
};

export default ModuleCard;