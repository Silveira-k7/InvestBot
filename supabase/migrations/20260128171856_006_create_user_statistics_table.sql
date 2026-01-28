/*
  # Create User Statistics Table

  1. New Tables
    - `user_statistics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key, unique)
      - `transaction_count` (integer, default: 0)
      - `current_balance` (numeric, default: 0)
      - `monthly_income` (numeric, default: 0)
      - `monthly_expenses` (numeric, default: 0)
      - `last_activity` (timestamp, nullable)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_statistics` table
    - Users can view only their own statistics
    - Admins can view all statistics

  3. Indexes
    - Create index on user_id (unique) for fast lookups
    - Create index on updated_at for sorting
*/

CREATE TABLE IF NOT EXISTS user_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  transaction_count INTEGER DEFAULT 0,
  current_balance NUMERIC DEFAULT 0,
  monthly_income NUMERIC DEFAULT 0,
  monthly_expenses NUMERIC DEFAULT 0,
  last_activity TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_statistics_user_id ON user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_statistics_updated_at ON user_statistics(updated_at);

ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own statistics"
  ON user_statistics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all statistics"
  ON user_statistics FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
