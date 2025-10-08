#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function debugSupabase() {
  console.log('🔍 Debugging Supabase Connection...\n');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables!');
    return;
  }

  console.log('✅ Environment variables found');
  console.log(`📡 Supabase URL: ${supabaseUrl}`);

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Check if we can connect to Supabase
    console.log('\n🧪 Test 1: Basic connection...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
    } else {
      console.log('✅ Basic connection successful');
    }

    // Test 2: Try to query the profiles table directly
    console.log('\n🧪 Test 2: Querying profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message);
      console.error('❌ Error details:', profilesError);
    } else {
      console.log('✅ Profiles table accessible');
      console.log('📊 Profiles data:', profiles);
    }

    // Test 3: Try to query information_schema to see what tables exist
    console.log('\n🧪 Test 3: Checking available tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('❌ Tables query error:', tablesError.message);
    } else {
      console.log('✅ Available tables:', tables?.map(t => t.table_name));
    }

    // Test 4: Try to create a simple test
    console.log('\n🧪 Test 4: Testing table creation...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(0);

    if (testError) {
      console.error('❌ Table structure error:', testError.message);
    } else {
      console.log('✅ Table structure is correct');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

debugSupabase();

