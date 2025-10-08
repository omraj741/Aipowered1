import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { chartAnimation } from '../../utils/animations';
import { generateFlakyTestData, getChartOptions } from '../../utils/chartUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FlakyTestsChart: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [chartData, setChartData] = useState(generateFlakyTestData(isDarkMode));
  const [options, setOptions] = useState<ChartOptions<'line'>>(getChartOptions(isDarkMode) as ChartOptions<'line'>);

  // Update chart when theme changes
  useEffect(() => {
    setChartData(generateFlakyTestData(isDarkMode));
    setOptions(getChartOptions(isDarkMode) as ChartOptions<'line'>);
  }, [isDarkMode]);

  return (
    <motion.div 
      className="h-64"
      variants={chartAnimation}
      initial="hidden"
      animate="visible"
    >
      <Line data={chartData} options={options} />
    </motion.div>
  );
};

export default FlakyTestsChart;