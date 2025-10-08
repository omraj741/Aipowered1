#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

console.log('🚀 AutoTest AI - Environment Setup');
console.log('=====================================\n');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupEnvironment();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  setupEnvironment();
}

function setupEnvironment() {
  console.log('\n📋 Please provide the following information:\n');
  
  const questions = [
    {
      key: 'VITE_SUPABASE_URL',
      prompt: 'Supabase Project URL (e.g., https://your-project.supabase.co): ',
      required: true
    },
    {
      key: 'VITE_SUPABASE_ANON_KEY',
      prompt: 'Supabase Anonymous Key: ',
      required: true
    },
    {
      key: 'DB_HOST',
      prompt: 'Database Host (default: localhost): ',
      required: false,
      default: 'localhost'
    },
    {
      key: 'DB_USER',
      prompt: 'Database User (default: root): ',
      required: false,
      default: 'root'
    },
    {
      key: 'DB_PASSWORD',
      prompt: 'Database Password: ',
      required: false,
      default: ''
    },
    {
      key: 'DB_NAME',
      prompt: 'Database Name (default: autotest_ai): ',
      required: false,
      default: 'autotest_ai'
    },
    {
      key: 'JWT_SECRET',
      prompt: 'JWT Secret Key (default: your-secret-key): ',
      required: false,
      default: 'your-secret-key'
    },
    {
      key: 'PORT',
      prompt: 'Backend Port (default: 3001): ',
      required: false,
      default: '3001'
    },
    {
      key: 'FRONTEND_URL',
      prompt: 'Frontend URL (default: http://localhost:5173): ',
      required: false,
      default: 'http://localhost:5173'
    },
    {
      key: 'NODE_ENV',
      prompt: 'Environment (default: development): ',
      required: false,
      default: 'development'
    }
  ];

  const envVars = {};
  let currentIndex = 0;

  function askQuestion() {
    if (currentIndex >= questions.length) {
      writeEnvFile();
      return;
    }

    const question = questions[currentIndex];
    const prompt = question.required 
      ? question.prompt 
      : `${question.prompt} (default: ${question.default}): `;

    rl.question(prompt, (answer) => {
      const value = answer.trim() || question.default || '';
      
      if (question.required && !value) {
        console.log('❌ This field is required!');
        askQuestion();
        return;
      }

      envVars[question.key] = value;
      currentIndex++;
      askQuestion();
    });
  }

  function writeEnvFile() {
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    try {
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ Environment file created successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. Set up your Supabase project at https://supabase.com');
      console.log('2. Run the database migrations in your Supabase SQL editor');
      console.log('3. Start the application with: npm run dev');
      console.log('\n📖 For detailed setup instructions, see SUPABASE_SETUP.md');
    } catch (error) {
      console.error('❌ Error creating .env file:', error.message);
    }

    rl.close();
  }

  askQuestion();
}
