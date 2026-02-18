import { supabase } from '../../lib/supabase';
import { AIInsight, SmartAlert } from '../../types';

export const insightsService = {
  async getInsights(userId: string): Promise<AIInsight[]> {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('dismissed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      priority: row.priority,
      category: row.category,
      actionRequired: row.action_required,
      createdAt: new Date(row.created_at)
    }));
  },

  async addInsight(userId: string, insight: Omit<AIInsight, 'id' | 'createdAt'>): Promise<AIInsight> {
    const { data, error } = await supabase
      .from('ai_insights')
      .insert([{
        user_id: userId,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        priority: insight.priority,
        category: insight.category,
        action_required: insight.actionRequired
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      type: data.type,
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category,
      actionRequired: data.action_required,
      createdAt: new Date(data.created_at)
    };
  },

  async dismissInsight(insightId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_insights')
      .update({ dismissed: true })
      .eq('id', insightId);

    if (error) throw error;
  },

  async getAlerts(userId: string): Promise<SmartAlert[]> {
    const { data, error } = await supabase
      .from('smart_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('dismissed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      priority: row.priority,
      actionRequired: row.action_required,
      dismissed: row.dismissed,
      createdAt: new Date(row.created_at)
    }));
  },

  async addAlert(userId: string, alert: Omit<SmartAlert, 'id' | 'createdAt' | 'dismissed'>): Promise<SmartAlert> {
    const { data, error } = await supabase
      .from('smart_alerts')
      .insert([{
        user_id: userId,
        type: alert.type,
        title: alert.title,
        message: alert.message,
        priority: alert.priority,
        action_required: alert.actionRequired,
        dismissed: false
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority,
      actionRequired: data.action_required,
      dismissed: data.dismissed,
      createdAt: new Date(data.created_at)
    };
  },

  async dismissAlert(alertId: string): Promise<void> {
    const { error } = await supabase
      .from('smart_alerts')
      .update({ dismissed: true })
      .eq('id', alertId);

    if (error) throw error;
  },

  async getAllNotifications(userId: string): Promise<{ insights: AIInsight[]; alerts: SmartAlert[] }> {
    const [insights, alerts] = await Promise.all([
      this.getInsights(userId),
      this.getAlerts(userId)
    ]);

    return { insights, alerts };
  }
};
