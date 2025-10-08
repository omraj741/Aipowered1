export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  timestamp: string;
}

export interface TestSuite {
  id: string;
  name: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  timestamp: string;
}

export interface HealingData {
  id: string;
  elementType: string;
  oldSelector: string;
  newSelector: string;
  confidence: number;
  timestamp: string;
  status: 'applied' | 'pending' | 'rejected';
}

export interface FlakyTest {
  id: string;
  name: string;
  failureRate: number;
  lastRun: string;
  occurrences: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  [key: string]: any;
}

export interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface BoltMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}