import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Terminal, ClipboardCheck, Database, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';
import ModuleCard from '../components/Dashboard/ModuleCard';
import TestResultsChart from '../components/Dashboard/TestResultsChart';
import HealingStatusChart from '../components/Dashboard/HealingStatusChart';
import FlakyTestsChart from '../components/Dashboard/FlakyTestsChart';
import TestExecutionModule from '../components/Dashboard/TestExecutionModule';
import FlakyTestsList from '../components/Dashboard/FlakyTestsList';
import HealingList from '../components/Dashboard/HealingList';
import CommandPanel from '../components/BoltAI/CommandPanel';
import URLInput from '../components/Dashboard/URLInput';
import { staggerChildren, fadeIn } from '../utils/animations';

const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard | AutoTest AI';
  }, []);

  const handleScreenClick = (e: React.MouseEvent) => {
    // Only redirect if clicking on non-interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button, input, a, [role="button"], .interactive');
    
    if (!isAuthenticated && !isInteractiveElement) {
      navigate('/login');
    }
  };
  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      onClick={handleScreenClick}
    >
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome to your test automation dashboard. Here's an overview of your test results.
          </p>
        </motion.div>

        <URLInput />
        
        {/* Quick stats */}
        <motion.div 
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        >
          <motion.div variants={fadeIn} className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-4 text-white shadow-md flex items-center interactive">
            <div className="bg-white/20 p-3 rounded-lg mr-4">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Total Tests</p>
              <h3 className="text-2xl font-bold">278</h3>
              <p className="text-xs text-white/70">+12 since last week</p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-4 text-white shadow-md flex items-center interactive">
            <div className="bg-white/20 p-3 rounded-lg mr-4">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Success Rate</p>
              <h3 className="text-2xl font-bold">92.4%</h3>
              <p className="text-xs text-white/70">+2.1% from yesterday</p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 text-white shadow-md flex items-center interactive">
            <div className="bg-white/20 p-3 rounded-lg mr-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Flaky Tests</p>
              <h3 className="text-2xl font-bold">8</h3>
              <p className="text-xs text-white/70">-3 since last week</p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Charts row */}
        <motion.div 
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
        >
          <motion.div variants={fadeIn} className="lg:col-span-1 interactive">
            <ModuleCard title="Test Results" icon={<BarChart3 size={24} />}>
              <TestResultsChart />
            </ModuleCard>
          </motion.div>
          
          <motion.div variants={fadeIn} className="lg:col-span-1 interactive">
            <ModuleCard title="Healing Status" icon={<Terminal size={24} />}>
              <HealingStatusChart />
            </ModuleCard>
          </motion.div>
          
          <motion.div variants={fadeIn} className="lg:col-span-1 interactive">
            <ModuleCard title="Flaky Tests Trend" icon={<AlertTriangle size={24} />}>
              <FlakyTestsChart />
            </ModuleCard>
          </motion.div>
        </motion.div>
        
        {/* Modules row */}
        <motion.div 
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={fadeIn} className="lg:col-span-1 interactive">
            <ModuleCard title="Test Execution" icon={<Terminal size={24} />}>
              <TestExecutionModule />
            </ModuleCard>
          </motion.div>
          
          <motion.div variants={fadeIn} className="lg:col-span-1 interactive">
            <ModuleCard title="Recent Healings" icon={<Database size={24} />}>
              <HealingList />
            </ModuleCard>
          </motion.div>
          
          <motion.div variants={fadeIn} className="lg:col-span-1 interactive">
            <ModuleCard title="Top Flaky Tests" icon={<AlertTriangle size={24} />}>
              <FlakyTestsList />
            </ModuleCard>
          </motion.div>
        </motion.div>
      </main>
      
      <CommandPanel />
    </div>
  );
};

export default DashboardPage;