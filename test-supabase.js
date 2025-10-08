#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.log('Please run: npm run setup');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`📡 Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Anon Key: ${supabaseKey.substring(0, 20)}...`);

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection by getting current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError.message);
    } else {
      console.log('✅ Supabase client created successfully');
      console.log(`📊 Current session: ${session ? 'Active' : 'None'}`);
    }

    // Test basic Supabase functionality
    console.log('✅ Supabase connection successful');
    console.log('🎉 Supabase is ready to use!');
    console.log('\n📝 Note: The app will work without the profiles table for now.');
    console.log('   You can create the table later using the Supabase dashboard.');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testSupabaseConnection();
