-- Migration: Initial Database Schema for Expense Tracker
-- Description: Creates all necessary tables for the expense tracking application

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  description TEXT,
  payment_method TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  recurring_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD'
);

-- Create recurring_transactions table
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  description TEXT,
  payment_method TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  next_occurrence DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create user_profiles table (email is optional for single-user apps)
CREATE TABLE IF NOT EXISTS user_profiles (
  email TEXT,
  full_name TEXT,
  default_currency TEXT DEFAULT 'USD'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_next_occurrence ON recurring_transactions(next_occurrence);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_active ON recurring_transactions(is_active);

-- Insert default categories (you can modify these as needed)
INSERT INTO categories (id, name, type, icon, color, is_default) VALUES
  ('cat-food', 'Food & Dining', 'expense', 'UtensilsCrossed', '#FF6B6B', true),
  ('cat-transportation', 'Transportation', 'expense', 'Car', '#4ECDC4', true),
  ('cat-entertainment', 'Entertainment', 'expense', 'Gamepad2', '#45B7D1', true),
  ('cat-shopping', 'Shopping', 'expense', 'ShoppingBag', '#96CEB4', true),
  ('cat-healthcare', 'Healthcare', 'expense', 'Heart', '#FCEA2B', true),
  ('cat-education', 'Education', 'expense', 'GraduationCap', '#FF8E53', true),
  ('cat-utilities', 'Utilities', 'expense', 'Zap', '#6C5CE7', true),
  ('cat-other-expense', 'Other', 'expense', 'MoreHorizontal', '#A29BFE', true),
  ('cat-salary', 'Salary', 'income', 'DollarSign', '#00B894', true),
  ('cat-business', 'Business', 'income', 'Briefcase', '#00CEC9', true),
  ('cat-investments', 'Investments', 'income', 'TrendingUp', '#0984E3', true),
  ('cat-other-income', 'Other', 'income', 'Plus', '#E17055', true)
ON CONFLICT (id) DO NOTHING;

-- Add Row Level Security (RLS) policies if needed (optional)
-- You can uncomment and modify these based on your authentication setup

-- Enable RLS on all tables
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (require user authentication setup)
-- CREATE POLICY "Users can view their own transactions" ON transactions
--   FOR SELECT USING (auth.uid()::text = user_id);

-- Note: You'll need to set up authentication and user management
-- if you want proper per-user data isolation
