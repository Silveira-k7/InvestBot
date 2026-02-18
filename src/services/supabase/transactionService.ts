import { supabase } from '../../lib/supabase';
import { Transaction } from '../../types';

export const transactionService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      type: row.type,
      amount: parseFloat(row.amount),
      description: row.description,
      category: row.category,
      date: new Date(row.date),
      createdAt: new Date(row.created_at)
    }));
  },

  async getTransactionsByPeriod(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      type: row.type,
      amount: parseFloat(row.amount),
      description: row.description,
      category: row.category,
      date: new Date(row.date),
      createdAt: new Date(row.created_at)
    }));
  },

  async addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        date: transaction.date.toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
      category: data.category,
      date: new Date(data.date),
      createdAt: new Date(data.created_at)
    };
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const updateData: Record<string, any> = {};

    if (updates.type) updateData.type = updates.type;
    if (updates.amount) updateData.amount = updates.amount;
    if (updates.description) updateData.description = updates.description;
    if (updates.category) updateData.category = updates.category;
    if (updates.date) updateData.date = updates.date.toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
      category: data.category,
      date: new Date(data.date),
      createdAt: new Date(data.created_at)
    };
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getTransactionsByCategory(userId: string): Promise<{ category: string; total: number }[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('category, amount, type')
      .eq('user_id', userId);

    if (error) throw error;

    const categoryTotals: Record<string, number> = {};

    (data || []).forEach(row => {
      const amount = parseFloat(row.amount);
      const adjustedAmount = row.type === 'income' ? amount : -amount;
      categoryTotals[row.category] = (categoryTotals[row.category] || 0) + adjustedAmount;
    });

    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total
    }));
  }
};
