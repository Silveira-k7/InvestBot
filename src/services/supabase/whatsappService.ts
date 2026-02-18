import { supabase } from '../../lib/supabase';

export interface WhatsAppMessage {
  id: string;
  userId: string;
  phoneNumber: string;
  message: string;
  messageType: 'outgoing' | 'incoming';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  whatsappMessageId?: string;
  createdAt: Date;
}

export const whatsappService = {
  async getMessages(userId: string, limit: number = 50): Promise<WhatsAppMessage[]> {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      phoneNumber: row.phone_number,
      message: row.message,
      messageType: row.message_type,
      status: row.status,
      whatsappMessageId: row.whatsapp_message_id,
      createdAt: new Date(row.created_at)
    }));
  },

  async getMessagesByPhone(userId: string, phoneNumber: string): Promise<WhatsAppMessage[]> {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('phone_number', phoneNumber)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      phoneNumber: row.phone_number,
      message: row.message,
      messageType: row.message_type,
      status: row.status,
      whatsappMessageId: row.whatsapp_message_id,
      createdAt: new Date(row.created_at)
    }));
  },

  async addMessage(userId: string, message: Omit<WhatsAppMessage, 'id' | 'createdAt'>): Promise<WhatsAppMessage> {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .insert([{
        user_id: userId,
        phone_number: message.phoneNumber,
        message: message.message,
        message_type: message.messageType,
        status: message.status,
        whatsapp_message_id: message.whatsappMessageId
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      phoneNumber: data.phone_number,
      message: data.message,
      messageType: data.message_type,
      status: data.status,
      whatsappMessageId: data.whatsapp_message_id,
      createdAt: new Date(data.created_at)
    };
  },

  async updateMessageStatus(messageId: string, status: 'sent' | 'delivered' | 'read' | 'failed'): Promise<void> {
    const { error } = await supabase
      .from('whatsapp_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) throw error;
  },

  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('whatsapp_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  }
};
