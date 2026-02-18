import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Goal, DashboardStats } from '../types';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from './AuthContext';
import { transactionService } from '../services/supabase/transactionService';
import { goalService } from '../services/supabase/goalService';

interface DataContextType {
  transactions: Transaction[];
  goals: Goal[];
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getTransactionsByPeriod: (startDate: Date, endDate: Date) => Transaction[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0
  });

  const loadData = async () => {
    if (!user) {
      setTransactions([]);
      setGoals([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [loadedTransactions, loadedGoals] = await Promise.all([
        transactionService.getTransactions(user.id),
        goalService.getGoals(user.id)
      ]);

      setTransactions(loadedTransactions);
      setGoals(loadedGoals);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
      console.error('Data loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

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

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newTransaction = await transactionService.addTransaction(user.id, transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add transaction';
      setError(message);
      throw err;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const updated = await transactionService.updateTransaction(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(message);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(message);
      throw err;
    }
  };

  const addGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newGoal = await goalService.addGoal(user.id, goalData);
      setGoals(prev => [newGoal, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add goal';
      setError(message);
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const updated = await goalService.updateGoal(id, updates);
      setGoals(prev => prev.map(g => g.id === id ? updated : g));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update goal';
      setError(message);
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await goalService.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete goal';
      setError(message);
      throw err;
    }
  };

  const getTransactionsByPeriod = (startDate: Date, endDate: Date): Transaction[] => {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider value={{
      transactions,
      goals,
      stats,
      isLoading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      getTransactionsByPeriod,
      refreshData
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