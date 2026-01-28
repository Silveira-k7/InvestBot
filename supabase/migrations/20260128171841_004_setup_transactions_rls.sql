/*
  # Setup RLS Policies for Transactions Table

  1. Security
    - Enable RLS on `transactions` table (if not already enabled)
    - Add policy for users to view their own transactions
    - Add policy for users to create transactions
    - Add policy for users to update their own transactions
    - Add policy for users to delete their own transactions
    - Add policy for admins to view all transactions

  2. Description
    This migration configures Row Level Security policies to ensure users
    can only access their own transaction data while admins can view all transactions.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can view own transactions') THEN
    CREATE POLICY "Users can view own transactions"
      ON transactions FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can create transactions') THEN
    CREATE POLICY "Users can create transactions"
      ON transactions FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can update own transactions') THEN
    CREATE POLICY "Users can update own transactions"
      ON transactions FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can delete own transactions') THEN
    CREATE POLICY "Users can delete own transactions"
      ON transactions FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Admins can view all transactions') THEN
    CREATE POLICY "Admins can view all transactions"
      ON transactions FOR SELECT
      TO authenticated
      USING (
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
      );
  END IF;
END $$;
