/*
  # Create WhatsApp Messages Table

  1. New Tables
    - `whatsapp_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `phone_number` (text, required)
      - `message` (text, required)
      - `message_type` (text: 'outgoing', 'incoming')
      - `status` (text: 'sent', 'delivered', 'read', 'failed')
      - `whatsapp_message_id` (text, nullable - external message ID)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `whatsapp_messages` table
    - Users can view only their own messages
    - Admins can view all messages

  3. Indexes
    - Create index on user_id for fast queries
    - Create index on phone_number for lookups
    - Create index on created_at for sorting
    - Create index on status for filtering
*/

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'outgoing' CHECK (message_type IN ('outgoing', 'incoming')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  whatsapp_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_id ON whatsapp_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_number ON whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON whatsapp_messages(status);

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON whatsapp_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages"
  ON whatsapp_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON whatsapp_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all messages"
  ON whatsapp_messages FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
