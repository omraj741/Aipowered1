import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { getMockTestResults } from '../../utils/mockData';
import { TestResult } from '../../types';

const statusIcons = {
  passed: <CheckCircle2 className="h-5 w-5 text-success-500" />,
  failed: <XCircle className="h-5 w-5 text-error-500" />,
  skipped: <AlertCircle className="h-5 w-5 text-warning-500" />,
};

const TestExecutionModule: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  
  const runTests = () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    
    // Simulate test execution with progressive updates
    const mockResults = getMockTestResults();
    const totalTests = mockResults.length;
    let currentTest = 0;
    
    const interval = setInterval(() => {
      if (currentTest < totalTests) {
        const newTest = mockResults[currentTest];
        setResults(prev => [...prev, newTest]);
        currentTest += 1;
        setProgress((currentTest / totalTests) * 100);
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setProgress(100);
      }
    }, 800);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={runTests}
          disabled={isRunning}
          isLoading={isRunning}
          icon={<Play size={16} />}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {isRunning ? (
            <span>Running... {Math.round(progress)}%</span>
          ) : results.length > 0 ? (
            <span>
              Completed: {results.filter(r => r.status === 'passed').length} passed, {results.filter(r => r.status === 'failed').length} failed
            </span>
          ) : (
            <span>Ready to run</span>
          )}
        </div>
      </div>
      
      {isRunning && (
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
      
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {results.length > 0 ? (
          results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex items-center space-x-2">
                {statusIcons[result.status]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {result.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(result.duration / 1000).toFixed(2)}s • {new Date(result.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>Click "Run Tests" to start execution</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestExecutionModule;