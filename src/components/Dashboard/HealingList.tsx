import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { getMockHealingData } from '../../utils/mockData';

const statusIcons = {
  applied: <CheckCircle2 className="h-5 w-5 text-success-500" />,
  pending: <Clock className="h-5 w-5 text-warning-500" />,
  rejected: <XCircle className="h-5 w-5 text-error-500" />,
};

const statusClasses = {
  applied: 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400',
  pending: 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400',
  rejected: 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400',
};

const HealingList: React.FC = () => {
  const healingData = getMockHealingData().slice(0, 5);
  
  return (
    <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
      {healingData.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              {statusIcons[item.status]}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.elementType} Element Healing
                </h4>
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <span className="inline-block w-14">From:</span> {item.oldSelector}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <span className="inline-block w-14">To:</span> {item.newSelector}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusClasses[item.status]}`}>
                {item.status}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.confidence.toFixed(1)}% confidence
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HealingList;