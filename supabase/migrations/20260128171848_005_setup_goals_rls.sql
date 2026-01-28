/*
  # Setup RLS Policies for Goals Table

  1. Security
    - Enable RLS on `goals` table (if not already enabled)
    - Add policy for users to view their own goals
    - Add policy for users to create goals
    - Add policy for users to update their own goals
    - Add policy for users to delete their own goals
    - Add policy for admins to view all goals

  2. Description
    This migration configures Row Level Security policies to ensure users
    can only access their own goal data while admins can view all goals.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'goals' AND policyname = 'Users can view own goals') THEN
    CREATE POLICY "Users can view own goals"
      ON goals FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'goals' AND policyname = 'Users can create goals') THEN
    CREATE POLICY "Users can create goals"
      ON goals FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'goals' AND policyname = 'Users can update own goals') THEN
    CREATE POLICY "Users can update own goals"
      ON goals FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'goals' AND policyname = 'Users can delete own goals') THEN
    CREATE POLICY "Users can delete own goals"
      ON goals FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'goals' AND policyname = 'Admins can view all goals') THEN
    CREATE POLICY "Admins can view all goals"
      ON goals FOR SELECT
      TO authenticated
      USING (
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
      );
  END IF;
END $$;
