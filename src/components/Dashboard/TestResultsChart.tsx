import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { chartAnimation } from '../../utils/animations';
import { generateTestResultsData, getChartOptions } from '../../utils/chartUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TestResultsChart: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [chartData, setChartData] = useState(generateTestResultsData(isDarkMode));
  const [options, setOptions] = useState<ChartOptions<'bar'>>(getChartOptions(isDarkMode) as ChartOptions<'bar'>);

  // Update chart when theme changes
  useEffect(() => {
    setChartData(generateTestResultsData(isDarkMode));
    setOptions(getChartOptions(isDarkMode) as ChartOptions<'bar'>);
  }, [isDarkMode]);

  return (
    <motion.div 
      className="h-64"
      variants={chartAnimation}
      initial="hidden"
      animate="visible"
    >
      <Bar data={chartData} options={options} />
    </motion.div>
  );
};

export default TestResultsChart;