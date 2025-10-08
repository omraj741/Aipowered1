# Supabase Setup Guide for AutoTest AI

## Project Analysis

This project is an **AutoTest AI Dashboard** that combines both frontend (React/TypeScript) and backend (Node.js/Express) components. The authentication system is currently set up to use **Supabase** for the frontend, with a hybrid approach that also includes a traditional backend.

## Current Authentication Setup

### Frontend (Supabase Integration)
- ✅ **Supabase client** configured in `src/lib/supabase.ts`
- ✅ **AuthContext** implemented with Supabase auth methods
- ✅ **LoginPage** component ready with signup/login functionality
- ✅ **Database schema** defined with proper TypeScript types
- ✅ **Row Level Security (RLS)** policies configured

### Backend (Traditional MySQL)
- ✅ **Express server** with authentication routes
- ✅ **JWT-based authentication** middleware
- ✅ **MySQL database** schema with user management
- ✅ **bcrypt** password hashing

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration (Required for frontend)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Configuration (Optional - for hybrid setup)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=autotest_ai
JWT_SECRET=your_jwt_secret_key
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Supabase Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Run Database Migrations
The project includes Supabase migrations in the `supabase/migrations/` folder:

- `20250830061933_red_fountain.sql` - Initial MySQL schema (for reference)
- `20250915074045_summer_flame.sql` - Supabase PostgreSQL schema with RLS

Run the second migration in your Supabase SQL editor to set up:
- `profiles` table with RLS policies
- `test_results` table with RLS policies  
- `healing_actions` table with RLS policies
- `flaky_tests` table with RLS policies

### 3. Configure Authentication
In your Supabase dashboard:
1. Go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:5173`)
3. Enable email authentication
4. Optionally configure email templates

### 4. Set Environment Variables
Create `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Schema

The Supabase schema includes:

### Tables
- **profiles** - User profiles linked to auth.users
- **test_results** - Test execution results
- **healing_actions** - AI-powered test healing actions
- **flaky_tests** - Flaky test tracking

### Security Features
- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access their own data
- Automatic `updated_at` timestamp triggers

## Running the Application

### Frontend Only (Supabase)
```bash
npm install
npm run dev
```

### Full Stack (Frontend + Backend)
```bash
# Install dependencies
npm install
npm run backend:install

# Start both frontend and backend
npm run dev        # Frontend on port 5173
npm run backend    # Backend on port 3001
```

## Authentication Flow

### Signup Process
1. User fills signup form with email, password, full name
2. Supabase creates auth user and sends verification email
3. Profile record created in `profiles` table
4. User redirected to dashboard after email verification

### Login Process
1. User enters email/password
2. Supabase authenticates user
3. AuthContext updates with user data
4. User redirected to dashboard

## Features Implemented

- ✅ **Responsive login/signup page** with animations
- ✅ **Email/password authentication** via Supabase
- ✅ **User profile management** with avatar support
- ✅ **Protected routes** with authentication context
- ✅ **Error handling** with user-friendly messages
- ✅ **Loading states** and form validation
- ✅ **Dark/light theme** support

## Next Steps

1. Set up your Supabase project
2. Add environment variables
3. Run the application
4. Test signup/login functionality
5. Customize the dashboard as needed

The authentication system is fully functional and ready to use!
