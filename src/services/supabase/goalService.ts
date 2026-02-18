import { supabase } from '../../lib/supabase';
import { Goal } from '../../types';

export const goalService = {
  async getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      targetAmount: parseFloat(row.target_amount),
      currentAmount: parseFloat(row.current_amount),
      deadline: new Date(row.deadline),
      category: row.category,
      status: row.status,
      createdAt: new Date(row.created_at)
    }));
  },

  async addGoal(userId: string, goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert([{
        user_id: userId,
        title: goal.title,
        description: goal.description,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        deadline: goal.deadline.toISOString().split('T')[0],
        category: goal.category,
        status: goal.status
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      targetAmount: parseFloat(data.target_amount),
      currentAmount: parseFloat(data.current_amount),
      deadline: new Date(data.deadline),
      category: data.category,
      status: data.status,
      createdAt: new Date(data.created_at)
    };
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const updateData: Record<string, any> = {};

    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.targetAmount) updateData.target_amount = updates.targetAmount;
    if (updates.currentAmount) updateData.current_amount = updates.currentAmount;
    if (updates.deadline) updateData.deadline = updates.deadline.toISOString().split('T')[0];
    if (updates.category) updateData.category = updates.category;
    if (updates.status) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      targetAmount: parseFloat(data.target_amount),
      currentAmount: parseFloat(data.current_amount),
      deadline: new Date(data.deadline),
      category: data.category,
      status: data.status,
      createdAt: new Date(data.created_at)
    };
  },

  async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getGoalProgress(userId: string): Promise<{ goalId: string; progress: number; title: string; status: string }[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('id, title, target_amount, current_amount, status')
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map(row => ({
      goalId: row.id,
      title: row.title,
      progress: (parseFloat(row.current_amount) / parseFloat(row.target_amount)) * 100,
      status: row.status
    }));
  }
};
