/*
  # Create AI Insights Table

  1. New Tables
    - `ai_insights`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (text: 'insight', 'recommendation', 'alert', 'prediction')
      - `title` (text, required)
      - `description` (text, required)
      - `priority` (text: 'high', 'medium', 'low')
      - `category` (text, optional)
      - `action_required` (boolean, default: false)
      - `dismissed` (boolean, default: false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `ai_insights` table
    - Users can only view their own insights
    - Users can dismiss/update their own insights

  3. Indexes
    - Create index on user_id for fast queries
    - Create index on created_at for sorting
    - Create index on dismissed for filtering
*/

CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'insight' CHECK (type IN ('insight', 'recommendation', 'alert', 'prediction')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT,
  action_required BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_insights_dismissed ON ai_insights(dismissed);

ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights"
  ON ai_insights FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
  ON ai_insights FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights"
  ON ai_insights FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert insights"
  ON ai_insights FOR INSERT
  TO authenticated
  WITH CHECK (true);
