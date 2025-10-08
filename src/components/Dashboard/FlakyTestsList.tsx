import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMockFlakyTests } from '../../utils/mockData';

const priorityClasses = {
  high: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
};

const FlakyTestsList: React.FC = () => {
  const flakyTests = getMockFlakyTests();
  
  return (
    <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
      {flakyTests.map((test, index) => (
        <motion.div
          key={test.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityClasses[test.priority]}`}>
                    {test.priority}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {test.failureRate.toFixed(1)}% failure rate
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {test.occurrences} occurrences
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FlakyTestsList;