import { ChartData, ChartDataset } from '../types';

// Generate random mock data for charts
export const generateMockData = (dataPoints: number = 7): number[] => {
  return Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 100));
};

// Generate dates for the last n days
export const generateDateLabels = (days: number = 7): string[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
};

// Get colors based on the current theme
export const getChartColors = (isDarkMode: boolean) => {
  return {
    primary: {
      light: 'rgba(59, 130, 246, 0.2)',
      main: 'rgba(59, 130, 246, 1)',
    },
    secondary: {
      light: 'rgba(20, 184, 166, 0.2)',
      main: 'rgba(20, 184, 166, 1)',
    },
    accent: {
      light: 'rgba(249, 115, 22, 0.2)',
      main: 'rgba(249, 115, 22, 1)',
    },
    success: {
      light: 'rgba(34, 197, 94, 0.2)',
      main: 'rgba(34, 197, 94, 1)',
    },
    warning: {
      light: 'rgba(245, 158, 11, 0.2)',
      main: 'rgba(245, 158, 11, 1)',
    },
    error: {
      light: 'rgba(239, 68, 68, 0.2)',
      main: 'rgba(239, 68, 68, 1)',
    },
    text: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
    gridLines: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };
};

// Create chart options for consistent styling
export const getChartOptions = (isDarkMode: boolean) => {
  const colors = getChartColors(isDarkMode);
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: colors.text,
          font: {
            family: 'Poppins',
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.gridLines,
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          labelTextColor: () => colors.text,
        },
      }
    },
    scales: {
      x: {
        ticks: {
          color: colors.text,
          font: {
            family: 'Poppins',
          }
        },
        grid: {
          color: colors.gridLines,
        }
      },
      y: {
        ticks: {
          color: colors.text,
          font: {
            family: 'Poppins',
          }
        },
        grid: {
          color: colors.gridLines,
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    }
  };
};

// Generate test results data for charts
export const generateTestResultsData = (isDarkMode: boolean): ChartData => {
  const colors = getChartColors(isDarkMode);
  
  return {
    labels: generateDateLabels(),
    datasets: [
      {
        label: 'Passed',
        data: generateMockData(),
        backgroundColor: colors.success.light,
        borderColor: colors.success.main,
        borderWidth: 2,
      },
      {
        label: 'Failed',
        data: generateMockData().map(value => value / 3),
        backgroundColor: colors.error.light,
        borderColor: colors.error.main,
        borderWidth: 2,
      },
      {
        label: 'Skipped',
        data: generateMockData().map(value => value / 5),
        backgroundColor: colors.warning.light,
        borderColor: colors.warning.main,
        borderWidth: 2,
      }
    ]
  };
};

// Generate healing status data for charts
export const generateHealingData = (isDarkMode: boolean): ChartData => {
  const colors = getChartColors(isDarkMode);
  
  return {
    labels: ['Applied', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          colors.success.light,
          colors.warning.light,
          colors.error.light
        ],
        borderColor: [
          colors.success.main,
          colors.warning.main,
          colors.error.main
        ],
        borderWidth: 2,
      }
    ]
  };
};

// Generate flaky test data for charts
export const generateFlakyTestData = (isDarkMode: boolean): ChartData => {
  const colors = getChartColors(isDarkMode);
  
  return {
    labels: generateDateLabels(),
    datasets: [
      {
        label: 'Flaky Test Count',
        data: generateMockData().map(value => value / 10),
        backgroundColor: colors.accent.light,
        borderColor: colors.accent.main,
        borderWidth: 2,
        tension: 0.3,
      }
    ]
  };
};