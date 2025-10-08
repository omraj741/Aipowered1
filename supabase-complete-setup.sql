-- Complete Supabase Setup for AutoTest AI
-- Run this entire script in your Supabase SQL Editor

-- ==============================================
-- 1. CREATE CUSTOM TYPES
-- ==============================================

-- Create custom types for better data validation
CREATE TYPE test_status AS ENUM ('passed', 'failed', 'skipped');
CREATE TYPE healing_status AS ENUM ('applied', 'pending', 'rejected');
CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');

-- ==============================================
-- 2. CREATE TRIGGER FUNCTION
-- ==============================================

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================
-- 3. CREATE PROFILES TABLE
-- ==============================================

-- Drop existing table if it exists (be careful with this in production)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================
-- 4. CREATE TEST RESULTS TABLE
-- ==============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.test_results CASCADE;

-- Create test_results table
CREATE TABLE public.test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_url text NOT NULL,
  status test_status NOT NULL,
  duration integer DEFAULT 0,
  error_message text,
  test_logs text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for test_results
CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON public.test_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================
-- 5. CREATE HEALING ACTIONS TABLE
-- ==============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.healing_actions CASCADE;

-- Create healing_actions table
CREATE TABLE public.healing_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_result_id uuid REFERENCES public.test_results(id) ON DELETE SET NULL,
  element_type text NOT NULL,
  old_selector text NOT NULL,
  new_selector text NOT NULL,
  confidence numeric(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  status healing_status DEFAULT 'pending',
  healing_logs text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for healing_actions
CREATE TRIGGER update_healing_actions_updated_at
  BEFORE UPDATE ON public.healing_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================
-- 6. CREATE FLAKY TESTS TABLE
-- ==============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.flaky_tests CASCADE;

-- Create flaky_tests table
CREATE TABLE public.flaky_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_url text NOT NULL,
  failure_rate numeric(5,2) NOT NULL CHECK (failure_rate >= 0 AND failure_rate <= 100),
  total_runs integer DEFAULT 0,
  failed_runs integer DEFAULT 0,
  last_failure timestamptz,
  priority priority_level DEFAULT 'medium',
  pattern_analysis text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, test_name, test_url)
);

-- Create trigger for flaky_tests
CREATE TRIGGER update_flaky_tests_updated_at
  BEFORE UPDATE ON public.flaky_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Test results indexes
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_status ON public.test_results(status);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON public.test_results(created_at);
CREATE INDEX IF NOT EXISTS idx_test_results_user_status ON public.test_results(user_id, status);
CREATE INDEX IF NOT EXISTS idx_test_results_user_date ON public.test_results(user_id, created_at);

-- Healing actions indexes
CREATE INDEX IF NOT EXISTS idx_healing_actions_user_id ON public.healing_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_healing_actions_status ON public.healing_actions(status);
CREATE INDEX IF NOT EXISTS idx_healing_actions_created_at ON public.healing_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_healing_actions_user_status ON public.healing_actions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_healing_actions_confidence ON public.healing_actions(confidence);

-- Flaky tests indexes
CREATE INDEX IF NOT EXISTS idx_flaky_tests_user_id ON public.flaky_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_flaky_tests_priority ON public.flaky_tests(priority);
CREATE INDEX IF NOT EXISTS idx_flaky_tests_failure_rate ON public.flaky_tests(failure_rate);
CREATE INDEX IF NOT EXISTS idx_flaky_tests_user_priority ON public.flaky_tests(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_flaky_tests_last_failure ON public.flaky_tests(last_failure);

-- ==============================================
-- 8. ENABLE ROW LEVEL SECURITY
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healing_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flaky_tests ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 9. CREATE RLS POLICIES
-- ==============================================

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Test results policies
CREATE POLICY "Users can read own test results"
  ON public.test_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results"
  ON public.test_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own test results"
  ON public.test_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own test results"
  ON public.test_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Healing actions policies
CREATE POLICY "Users can read own healing actions"
  ON public.healing_actions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own healing actions"
  ON public.healing_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own healing actions"
  ON public.healing_actions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own healing actions"
  ON public.healing_actions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Flaky tests policies
CREATE POLICY "Users can read own flaky tests"
  ON public.flaky_tests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flaky tests"
  ON public.flaky_tests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flaky tests"
  ON public.flaky_tests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flaky tests"
  ON public.flaky_tests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ==============================================
-- 10. CREATE SAMPLE DATA (OPTIONAL)
-- ==============================================

-- Insert sample test results (uncomment if you want sample data)
/*
-- Note: This will only work after you have created a user account
-- Replace 'your-user-id-here' with an actual user ID from auth.users

INSERT INTO public.test_results (user_id, test_name, test_url, status, duration, error_message) VALUES
('your-user-id-here', 'Login Test', 'https://example.com/login', 'passed', 1500, null),
('your-user-id-here', 'Signup Test', 'https://example.com/signup', 'failed', 2000, 'Element not found: #signup-button'),
('your-user-id-here', 'Dashboard Test', 'https://example.com/dashboard', 'passed', 800, null);

INSERT INTO public.healing_actions (user_id, test_result_id, element_type, old_selector, new_selector, confidence, status) VALUES
('your-user-id-here', (SELECT id FROM public.test_results WHERE test_name = 'Signup Test' LIMIT 1), 'button', '#signup-button', '#sign-up-btn', 95.5, 'applied');

INSERT INTO public.flaky_tests (user_id, test_name, test_url, failure_rate, total_runs, failed_runs, priority) VALUES
('your-user-id-here', 'Payment Test', 'https://example.com/payment', 25.5, 20, 5, 'high');
*/

-- ==============================================
-- 11. VERIFICATION QUERIES
-- ==============================================

-- Check if all tables were created successfully
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'test_results', 'healing_actions', 'flaky_tests')
ORDER BY tablename;

-- Check if RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'test_results', 'healing_actions', 'flaky_tests')
ORDER BY tablename;

-- Check if policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==============================================
-- SETUP COMPLETE!
-- ==============================================

-- Your Supabase database is now ready for the AutoTest AI application!
-- 
-- Next steps:
-- 1. Set your environment variables in .env file
-- 2. Run: npm run dev
-- 3. Test signup/login functionality
-- 4. Verify data is being created in the tables
