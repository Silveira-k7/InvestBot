import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Goal, DashboardStats } from '../types';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { useAuth } from './AuthContext';

interface DataContextType {
  transactions: Transaction[];
  goals: Goal[];
  stats: DashboardStats;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getTransactionsByPeriod: (startDate: Date, endDate: Date) => Transaction[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'income',
    amount: 8500,
    description: 'Salário Janeiro',
    category: 'Salário',
    date: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    userId: '1',
    type: 'expense',
    amount: 1200,
    description: 'Aluguel',
    category: 'Moradia',
    date: new Date('2024-01-05'),
    createdAt: new Date('2024-01-05')
  },
  {
    id: '3',
    userId: '1',
    type: 'expense',
    amount: 450,
    description: 'Supermercado',
    category: 'Alimentação',
    date: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    userId: '1',
    type: 'expense',
    amount: 80,
    description: 'Combustível',
    category: 'Transporte',
    date: new Date('2024-01-12'),
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    userId: '1',
    type: 'income',
    amount: 500,
    description: 'Freelancer',
    category: 'Renda Extra',
    date: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15')
  }
];

const mockGoals: Goal[] = [
  {
    id: '1',
    userId: '1',
    title: 'Reserva de Emergência',
    description: 'Acumular 6 meses de gastos',
    targetAmount: 30000,
    currentAmount: 15000,
    deadline: new Date('2024-12-31'),
    category: 'savings',
    status: 'active',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    userId: '1',
    title: 'Limite Gastos Janeiro',
    description: 'Não gastar mais que R$ 2.500',
    targetAmount: 2500,
    currentAmount: 1730,
    deadline: new Date('2024-01-31'),
    category: 'expense-limit',
    status: 'active',
    createdAt: new Date('2024-01-01')
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0
  });

  // Load mock data when user logs in
  useEffect(() => {
    if (user) {
      setTransactions(mockTransactions);
      setGoals(mockGoals);
    } else {
      setTransactions([]);
      setGoals([]);
    }
  }, [user]);

  // Calculate stats whenever transactions change
  useEffect(() => {
    if (!user) return;

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const monthlyTransactions = transactions.filter(t => 
      t.date >= monthStart && t.date <= monthEnd
    );

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = transactions.reduce((sum, t) => 
      t.type === 'income' ? sum + t.amount : sum - t.amount, 0
    );

    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    setStats({
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate
    });
  }, [transactions, user]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date(),
      ...transactionData
    };

    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date(),
      ...goalData
    };

    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, ...updates } : g
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const getTransactionsByPeriod = (startDate: Date, endDate: Date): Transaction[] => {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  };

  return (
    <DataContext.Provider value={{
      transactions,
      goals,
      stats,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      getTransactionsByPeriod
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};