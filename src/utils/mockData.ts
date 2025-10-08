import { TestResult, TestSuite, HealingData, FlakyTest } from '../types';

// Generate mock test results
export const getMockTestResults = (): TestResult[] => {
  const statuses: ('passed' | 'failed' | 'skipped')[] = ['passed', 'failed', 'skipped'];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `test-${i + 1}`,
    name: `Test Case ${i + 1}: Validate ${['Login', 'Signup', 'Profile', 'Dashboard', 'Settings'][i % 5]} ${['UI', 'API', 'Functionality', 'Performance'][i % 4]}`,
    status: statuses[Math.floor(Math.random() * 3)],
    duration: Math.floor(Math.random() * 10000),
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
  }));
};

// Generate mock test suites
export const getMockTestSuites = (): TestSuite[] => {
  return Array.from({ length: 5 }, (_, i) => {
    const totalTests = Math.floor(Math.random() * 50) + 10;
    const passed = Math.floor(Math.random() * totalTests);
    const failed = Math.floor(Math.random() * (totalTests - passed));
    const skipped = totalTests - passed - failed;
    
    return {
      id: `suite-${i + 1}`,
      name: [`User Authentication`, `Page Navigation`, `Data Processing`, `API Integration`, `Performance Testing`][i],
      totalTests,
      passed,
      failed,
      skipped,
      duration: Math.floor(Math.random() * 50000) + 10000,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
    };
  });
};

// Generate mock healing data
export const getMockHealingData = (): HealingData[] => {
  const elementTypes = ['button', 'input', 'div', 'span', 'a', 'img', 'select'];
  const statuses: ('applied' | 'pending' | 'rejected')[] = ['applied', 'pending', 'rejected'];
  
  return Array.from({ length: 15 }, (_, i) => {
    const elementType = elementTypes[Math.floor(Math.random() * elementTypes.length)];
    
    return {
      id: `healing-${i + 1}`,
      elementType,
      oldSelector: `#${elementType}-old-${i}`,
      newSelector: `#${elementType}-new-${i}`,
      confidence: Math.random() * 40 + 60, // 60-100%
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      status: statuses[Math.floor(Math.random() * 3)]
    };
  });
};

// Generate mock flaky tests
export const getMockFlakyTests = (): FlakyTest[] => {
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  
  return Array.from({ length: 8 }, (_, i) => {
    return {
      id: `flaky-${i + 1}`,
      name: `Flaky Test ${i + 1}: ${['Login Validation', 'Data Sync', 'UI Rendering', 'API Response', 'Navigation Flow', 'Authentication', 'Profile Update', 'Search Functionality'][i]}`,
      failureRate: Math.random() * 50 + 10, // 10-60%
      lastRun: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
      occurrences: Math.floor(Math.random() * 20) + 1,
      priority: priorities[Math.floor(Math.random() * 3)]
    };
  });
};

// Generate mock conversation history for Bolt AI
export const getMockBoltConversation = () => {
  return [
    {
      id: '1',
      role: 'user' as const,
      content: 'Why is my login test failing?',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'Based on the test logs, the login test is failing because the selector for the login button has changed from "#login-btn" to ".btn-login". I can automatically heal this selector in your test. Would you like me to apply this fix?',
      timestamp: new Date(Date.now() - 280000).toISOString()
    },
    {
      id: '3',
      role: 'user' as const,
      content: 'Yes, please fix it.',
      timestamp: new Date(Date.now() - 260000).toISOString()
    },
    {
      id: '4',
      role: 'assistant' as const,
      content: 'I\'ve updated the selector in your test. The change has been applied and the test now passes successfully. Would you like me to create a report of this healing action?',
      timestamp: new Date(Date.now() - 240000).toISOString()
    }
  ];
};