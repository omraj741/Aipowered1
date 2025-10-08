import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import TestResultsChart from './TestResultsChart';
import FlakyTestsChart from './FlakyTestsChart';
import HealingList from './HealingList';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'results' | 'healing' | 'flaky';
  title: string;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, type, title }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto">
            {type === 'results' && (
              <div className="space-y-6">
                <div className="h-96">
                  <TestResultsChart />
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Test Logs</h3>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                    {`[INFO] Starting test execution...
[SUCCESS] Login functionality test passed
[ERROR] Navigation test failed - Element not found
[INFO] Running healing actions...
[SUCCESS] Element selector updated successfully`}
                  </pre>
                </div>
              </div>
            )}
            
            {type === 'healing' && (
              <div className="space-y-6">
                <HealingList />
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Healing Actions</h3>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                    {`[ACTION] Analyzing failed selectors...
[UPDATE] Updated button selector from #login-btn to .btn-primary
[VERIFY] Testing new selector...
[SUCCESS] Selector verified and updated`}
                  </pre>
                </div>
              </div>
            )}
            
            {type === 'flaky' && (
              <div className="space-y-6">
                <div className="h-96">
                  <FlakyTestsChart />
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Analysis</h3>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                    {`[ANALYSIS] Identified timing issues in async operations
[PATTERN] Test fails intermittently during peak load
[SUGGESTION] Implement retry mechanism
[ACTION] Adding wait conditions for stability`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailModal;