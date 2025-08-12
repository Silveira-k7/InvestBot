export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: 'user' | 'admin';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: 'savings' | 'expense-limit' | 'investment' | 'other';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

export interface AIInsight {
  id: string;
  type: 'insight' | 'recommendation' | 'alert' | 'prediction';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionRequired: boolean;
  createdAt: Date;
}

export interface SmartAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  message: string;
  priority: number;
  actionRequired: boolean;
  dismissed?: boolean;
  createdAt: Date;
}

export interface SpendingAnalysis {
  insights: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  categories: {
    category: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    percentage: number;
  }[];
}

export interface FinancialAdvice {
  advice: string;
  priority: 'high' | 'medium' | 'low';
  actionItems: string[];
}

export interface ExpensePrediction {
  nextMonthPrediction: number;
  categoryPredictions: {
    category: string;
    predicted: number;
    confidence: number;
  }[];
  trends: {
    category: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
  }[];
}