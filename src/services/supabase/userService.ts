import { supabase } from '../../lib/supabase';
import { User } from '../../types';

export const userService = {
  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar,
      role: data.role,
      createdAt: new Date(data.created_at)
    };
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar,
      role: data.role,
      createdAt: new Date(data.created_at)
    };
  },

  async createUser(userData: { name: string; email: string; phone?: string; avatar?: string }): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: userData.avatar,
        role: 'user',
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar,
      role: data.role,
      createdAt: new Date(data.created_at)
    };
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const updateData: Record<string, any> = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.avatar) updateData.avatar = updates.avatar;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar,
      role: data.role,
      createdAt: new Date(data.created_at)
    };
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      avatar: row.avatar,
      role: row.role,
      createdAt: new Date(row.created_at)
    }));
  },

  async updateUserActivity(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
  }
};
