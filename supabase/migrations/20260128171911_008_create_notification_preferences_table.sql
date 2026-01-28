/*
  # Create Notification Preferences Table

  1. New Tables
    - `notification_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key, unique)
      - `email_notifications` (boolean, default: true)
      - `whatsapp_notifications` (boolean, default: true)
      - `alert_threshold` (numeric, default: 1000)
      - `daily_summary` (boolean, default: false)
      - `weekly_report` (boolean, default: true)
      - `spending_alerts` (boolean, default: true)
      - `goal_reminders` (boolean, default: true)
      - `ai_insights` (boolean, default: true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `notification_preferences` table
    - Users can view only their own preferences
    - Users can update only their own preferences

  3. Indexes
    - Create index on user_id (unique) for fast lookups
*/

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  whatsapp_notifications BOOLEAN DEFAULT true,
  alert_threshold NUMERIC DEFAULT 1000,
  daily_summary BOOLEAN DEFAULT false,
  weekly_report BOOLEAN DEFAULT true,
  spending_alerts BOOLEAN DEFAULT true,
  goal_reminders BOOLEAN DEFAULT true,
  ai_insights BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
