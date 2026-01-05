import { createClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      test_results: {
        Row: {
          id: string;
          user_id: string;
          test_name: string;
          test_url: string;
          status: "passed" | "failed" | "skipped";
          duration: number;
          error_message: string | null;
          test_logs: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_name: string;
          test_url: string;
          status: "passed" | "failed" | "skipped";
          duration?: number;
          error_message?: string | null;
          test_logs?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_name?: string;
          test_url?: string;
          status?: "passed" | "failed" | "skipped";
          duration?: number;
          error_message?: string | null;
          test_logs?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      healing_actions: {
        Row: {
          id: string;
          user_id: string;
          test_result_id: string | null;
          element_type: string;
          old_selector: string;
          new_selector: string;
          confidence: number;
          status: "applied" | "pending" | "rejected";
          healing_logs: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_result_id?: string | null;
          element_type: string;
          old_selector: string;
          new_selector: string;
          confidence: number;
          status?: "applied" | "pending" | "rejected";
          healing_logs?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_result_id?: string | null;
          element_type?: string;
          old_selector?: string;
          new_selector?: string;
          confidence?: number;
          status?: "applied" | "pending" | "rejected";
          healing_logs?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      flaky_tests: {
        Row: {
          id: string;
          user_id: string;
          test_name: string;
          test_url: string;
          failure_rate: number;
          total_runs: number;
          failed_runs: number;
          last_failure: string | null;
          priority: "high" | "medium" | "low";
          pattern_analysis: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_name: string;
          test_url: string;
          failure_rate: number;
          total_runs?: number;
          failed_runs?: number;
          last_failure?: string | null;
          priority?: "high" | "medium" | "low";
          pattern_analysis?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_name?: string;
          test_url?: string;
          failure_rate?: number;
          total_runs?: number;
          failed_runs?: number;
          last_failure?: string | null;
          priority?: "high" | "medium" | "low";
          pattern_analysis?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
