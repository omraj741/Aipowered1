import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { chartAnimation } from '../../utils/animations';
import { generateHealingData, getChartOptions } from '../../utils/chartUtils';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const HealingStatusChart: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [chartData, setChartData] = useState(generateHealingData(isDarkMode));
  const [options, setOptions] = useState<ChartOptions<'pie'>>(getChartOptions(isDarkMode) as ChartOptions<'pie'>);

  // Update chart when theme changes
  useEffect(() => {
    setChartData(generateHealingData(isDarkMode));
    setOptions(getChartOptions(isDarkMode) as ChartOptions<'pie'>);
  }, [isDarkMode]);

  return (
    <motion.div 
      className="h-64 flex items-center justify-center"
      variants={chartAnimation}
      initial="hidden"
      animate="visible"
    >
      <Pie data={chartData} options={options} />
    </motion.div>
  );
};

export default HealingStatusChart;