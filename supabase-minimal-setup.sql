-- Minimal Supabase Setup for AutoTest AI
-- Run this in your Supabase SQL Editor for basic functionality

-- ==============================================
-- 1. CREATE TRIGGER FUNCTION
-- ==============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================
-- 2. CREATE PROFILES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================
-- 3. CREATE TEST RESULTS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS public.test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_url text NOT NULL,
  status text NOT NULL CHECK (status IN ('passed', 'failed', 'skipped')),
  duration integer DEFAULT 0,
  error_message text,
  test_logs text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for test_results
DROP TRIGGER IF EXISTS update_test_results_updated_at ON public.test_results;
CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON public.test_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 5. CREATE ESSENTIAL RLS POLICIES
-- ==============================================

-- Profiles policies
CREATE POLICY IF NOT EXISTS "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Test results policies
CREATE POLICY IF NOT EXISTS "Users can read own test results"
  ON public.test_results FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own test results"
  ON public.test_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own test results"
  ON public.test_results FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own test results"
  ON public.test_results FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ==============================================
-- SETUP COMPLETE!
-- ==============================================

-- Your basic Supabase setup is ready!
-- This includes:
-- ✅ Profiles table with RLS
-- ✅ Test results table with RLS  
-- ✅ Automatic updated_at triggers
-- ✅ User isolation via RLS policies
