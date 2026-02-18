import { supabase } from '../../lib/supabase';

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  alertThreshold: number;
  dailySummary: boolean;
  weeklyReport: boolean;
  spendingAlerts: boolean;
  goalReminders: boolean;
  aiInsights: boolean;
}

export const notificationService = {
  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      emailNotifications: data.email_notifications,
      whatsappNotifications: data.whatsapp_notifications,
      alertThreshold: parseFloat(data.alert_threshold),
      dailySummary: data.daily_summary,
      weeklyReport: data.weekly_report,
      spendingAlerts: data.spending_alerts,
      goalReminders: data.goal_reminders,
      aiInsights: data.ai_insights
    };
  },

  async createPreferences(userId: string): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .insert([{
        user_id: userId,
        email_notifications: true,
        whatsapp_notifications: true,
        alert_threshold: 1000,
        daily_summary: false,
        weekly_report: true,
        spending_alerts: true,
        goal_reminders: true,
        ai_insights: true
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      emailNotifications: data.email_notifications,
      whatsappNotifications: data.whatsapp_notifications,
      alertThreshold: parseFloat(data.alert_threshold),
      dailySummary: data.daily_summary,
      weeklyReport: data.weekly_report,
      spendingAlerts: data.spending_alerts,
      goalReminders: data.goal_reminders,
      aiInsights: data.ai_insights
    };
  },

  async updatePreferences(userId: string, updates: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const updateData: Record<string, any> = {};

    if (updates.emailNotifications !== undefined) updateData.email_notifications = updates.emailNotifications;
    if (updates.whatsappNotifications !== undefined) updateData.whatsapp_notifications = updates.whatsappNotifications;
    if (updates.alertThreshold !== undefined) updateData.alert_threshold = updates.alertThreshold;
    if (updates.dailySummary !== undefined) updateData.daily_summary = updates.dailySummary;
    if (updates.weeklyReport !== undefined) updateData.weekly_report = updates.weeklyReport;
    if (updates.spendingAlerts !== undefined) updateData.spending_alerts = updates.spendingAlerts;
    if (updates.goalReminders !== undefined) updateData.goal_reminders = updates.goalReminders;
    if (updates.aiInsights !== undefined) updateData.ai_insights = updates.aiInsights;

    const { data, error } = await supabase
      .from('notification_preferences')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      emailNotifications: data.email_notifications,
      whatsappNotifications: data.whatsapp_notifications,
      alertThreshold: parseFloat(data.alert_threshold),
      dailySummary: data.daily_summary,
      weeklyReport: data.weekly_report,
      spendingAlerts: data.spending_alerts,
      goalReminders: data.goal_reminders,
      aiInsights: data.ai_insights
    };
  },

  async getOrCreatePreferences(userId: string): Promise<NotificationPreferences> {
    let preferences = await this.getPreferences(userId);

    if (!preferences) {
      preferences = await this.createPreferences(userId);
    }

    return preferences;
  }
};
