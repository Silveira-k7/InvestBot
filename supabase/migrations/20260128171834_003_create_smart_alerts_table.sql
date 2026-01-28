/*
  # Create Smart Alerts Table

  1. New Tables
    - `smart_alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (text: 'warning', 'info', 'success', 'danger')
      - `title` (text, required)
      - `message` (text, required)
      - `priority` (integer, 1-5)
      - `action_required` (boolean, default: false)
      - `dismissed` (boolean, default: false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `smart_alerts` table
    - Users can only view their own alerts
    - Users can dismiss their own alerts

  3. Indexes
    - Create index on user_id for fast queries
    - Create index on created_at for sorting
    - Create index on dismissed for filtering
*/

CREATE TABLE IF NOT EXISTS smart_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('warning', 'info', 'success', 'danger')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  action_required BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_smart_alerts_user_id ON smart_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_created_at ON smart_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_dismissed ON smart_alerts(dismissed);

ALTER TABLE smart_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON smart_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON smart_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON smart_alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert alerts"
  ON smart_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);
