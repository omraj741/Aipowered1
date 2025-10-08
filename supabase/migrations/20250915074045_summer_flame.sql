/*
  # AutoTest AI Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `test_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `test_name` (text)
      - `test_url` (text)
      - `status` (enum: passed, failed, skipped)
      - `duration` (integer, milliseconds)
      - `error_message` (text)
      - `test_logs` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `healing_actions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `test_result_id` (uuid, references test_results)
      - `element_type` (text)
      - `old_selector` (text)
      - `new_selector` (text)
      - `confidence` (numeric, 0-100)
      - `status` (enum: applied, pending, rejected)
      - `healing_logs` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `flaky_tests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `test_name` (text)
      - `test_url` (text)
      - `failure_rate` (numeric, 0-100)
      - `total_runs` (integer)
      - `failed_runs` (integer)
      - `last_failure` (timestamp)
      - `priority` (enum: high, medium, low)
      - `pattern_analysis` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE test_status AS ENUM ('passed', 'failed', 'skipped');
CREATE TYPE healing_status AS ENUM ('applied', 'pending', 'rejected');
CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_url text NOT NULL,
  status test_status NOT NULL,
  duration integer DEFAULT 0,
  error_message text,
  test_logs text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create healing_actions table
CREATE TABLE IF NOT EXISTS healing_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_result_id uuid REFERENCES test_results(id) ON DELETE SET NULL,
  element_type text NOT NULL,
  old_selector text NOT NULL,
  new_selector text NOT NULL,
  confidence numeric(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  status healing_status DEFAULT 'pending',
  healing_logs text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flaky_tests table
CREATE TABLE IF NOT EXISTS flaky_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE healing_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flaky_tests ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for test_results
CREATE POLICY "Users can read own test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results"
  ON test_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own test results"
  ON test_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own test results"
  ON test_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for healing_actions
CREATE POLICY "Users can read own healing actions"
  ON healing_actions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own healing actions"
  ON healing_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own healing actions"
  ON healing_actions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own healing actions"
  ON healing_actions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for flaky_tests
CREATE POLICY "Users can read own flaky tests"
  ON flaky_tests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flaky tests"
  ON flaky_tests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flaky tests"
  ON flaky_tests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flaky tests"
  ON flaky_tests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_status ON test_results(status);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at);

CREATE INDEX IF NOT EXISTS idx_healing_actions_user_id ON healing_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_healing_actions_status ON healing_actions(status);
CREATE INDEX IF NOT EXISTS idx_healing_actions_created_at ON healing_actions(created_at);

CREATE INDEX IF NOT EXISTS idx_flaky_tests_user_id ON flaky_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_flaky_tests_priority ON flaky_tests(priority);
CREATE INDEX IF NOT EXISTS idx_flaky_tests_failure_rate ON flaky_tests(failure_rate);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON test_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_healing_actions_updated_at
  BEFORE UPDATE ON healing_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flaky_tests_updated_at
  BEFORE UPDATE ON flaky_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();