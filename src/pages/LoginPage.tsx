import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Terminal, User, CheckCircle, AlertCircle } from 'lucide-react';
import { fadeIn, slideUp } from '../utils/animations';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import ParticlesBackground from '../components/ui/ParticlesBackground';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LoginPage: React.FC = () => {
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    document.title = 'Login | AutoTest AI';
    return () => {
      setIsLoading(false);
      setError('');
      setMessage('');
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Password strength calculation
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const validateForm = () => {
    if (isSignup) {
      if (!fullName.trim()) {
        setError('Full name is required');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      // Forgot Password Flow
      try {
        setIsLoading(true);
        setError('');
        setMessage('');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('Password reset link sent! Please check your email.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error sending reset link');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      if (isSignup) {
        await signup(email, password, fullName);
        setMessage('Account created successfully! Please check your email to confirm before signing in.');
        setIsSignup(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setIsForgotPassword(false);
    setError('');
    setMessage('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPasswordStrength(0);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignup(false);
    setError('');
    setMessage('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      <ParticlesBackground />
      <div className="w-full max-w-md px-6 z-10">
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8 text-center">
          <motion.div
            className="inline-flex items-center justify-center p-3 bg-white bg-opacity-10 rounded-full mb-4"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Terminal className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1 className="text-3xl font-bold text-white">AutoTest <span className="text-primary-400">AI</span></motion.h1>
          <motion.p className="mt-2 text-gray-300">Next generation test automation platform</motion.p>
        </motion.div>

        <motion.div variants={slideUp} initial="hidden" animate="visible" className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {isForgotPassword
                ? 'Reset your password'
                : isSignup
                ? 'Create your account'
                : 'Sign in to your account'}
            </h2>

            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">{error}</div>}
            {message && <div className="mb-4 p-3 bg-green-50 dark:bg-emerald-900/20 text-green-700 dark:text-emerald-400 rounded-lg text-sm">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" className="input-floating pl-10 w-full" placeholder=" " value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  <label className="floating-label transition-all pl-10">Full Name</label>
                </div>
              )}

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" className="input-floating pl-10 w-full" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label className="floating-label transition-all pl-10">Email</label>
              </div>

              {/* Password Field (not shown in Forgot Password mode) */}
              {!isForgotPassword && (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-floating pl-10 pr-10 w-full"
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={isSignup ? 8 : 6}
                    />
                    <label className="floating-label transition-all pl-10">Password</label>
                    <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>

                  {isSignup && password && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }} />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Password must include: 8+ chars, uppercase, lowercase, number, special character</div>
                    </div>
                  )}

                  {isSignup && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="input-floating pl-10 pr-10 w-full"
                        placeholder=" "
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                      <label className="floating-label transition-all pl-10">Confirm Password</label>
                      <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                      {confirmPassword && (
                        <div className="absolute -bottom-6 right-0">
                          {password === confirmPassword ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Action Button */}
              <Button
                type="submit"
                className="w-full py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
                isLoading={isLoading}
                disabled={isSignup && (password !== confirmPassword || passwordStrength < 2)}
              >
                {isForgotPassword ? 'Send Reset Link' : isSignup ? 'Create Account' : 'Sign in'}
              </Button>

              {/* Footer Links */}
              <div className="text-center space-y-2">
                {!isForgotPassword && (
                  <button
                    type="button"
                    onClick={toggleForgotPassword}
                    className="block w-full text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Forgot password?
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="block w-full text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {isForgotPassword ? 'Back to sign in' : isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
