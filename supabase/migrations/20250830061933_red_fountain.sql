-- AutoTest AI Database Schema
-- This file contains the complete database schema for the AutoTest AI application

-- Create database (run this manually in MySQL)
-- CREATE DATABASE IF NOT EXISTS autotest_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE autotest_ai;

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Test results table to store all test execution data
CREATE TABLE IF NOT EXISTS test_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  test_name VARCHAR(500) NOT NULL,
  test_url TEXT NOT NULL,
  status ENUM('passed', 'failed', 'skipped') NOT NULL,
  duration INT DEFAULT 0 COMMENT 'Duration in milliseconds',
  error_message TEXT NULL,
  test_logs LONGTEXT NULL COMMENT 'Complete test execution logs',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_user_status (user_id, status),
  INDEX idx_user_date (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Healing actions table to track AI-powered test healing
CREATE TABLE IF NOT EXISTS healing_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  test_result_id INT NULL COMMENT 'Related test result that triggered healing',
  element_type VARCHAR(100) NOT NULL COMMENT 'Type of element (button, input, div, etc.)',
  old_selector VARCHAR(1000) NOT NULL COMMENT 'Original selector that failed',
  new_selector VARCHAR(1000) NOT NULL COMMENT 'New selector suggested by AI',
  confidence DECIMAL(5,2) NOT NULL COMMENT 'AI confidence percentage (0-100)',
  status ENUM('applied', 'pending', 'rejected') DEFAULT 'pending',
  healing_logs TEXT NULL COMMENT 'Logs from the healing process',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (test_result_id) REFERENCES test_results(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_confidence (confidence),
  INDEX idx_created_at (created_at),
  INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Flaky tests table to track tests with inconsistent results
CREATE TABLE IF NOT EXISTS flaky_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  test_name VARCHAR(500) NOT NULL,
  test_url TEXT NOT NULL,
  failure_rate DECIMAL(5,2) NOT NULL COMMENT 'Failure rate percentage (0-100)',
  total_runs INT DEFAULT 0 COMMENT 'Total number of test runs',
  failed_runs INT DEFAULT 0 COMMENT 'Number of failed runs',
  last_failure TIMESTAMP NULL COMMENT 'Timestamp of last failure',
  priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
  pattern_analysis TEXT NULL COMMENT 'AI analysis of failure patterns',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_failure_rate (failure_rate),
  INDEX idx_priority (priority),
  INDEX idx_last_failure (last_failure),
  INDEX idx_user_priority (user_id, priority),
  UNIQUE KEY unique_user_test (user_id, test_name, test_url(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Test suites table to group related tests
CREATE TABLE IF NOT EXISTS test_suites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  suite_name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  total_tests INT DEFAULT 0,
  passed_tests INT DEFAULT 0,
  failed_tests INT DEFAULT 0,
  skipped_tests INT DEFAULT 0,
  duration INT DEFAULT 0 COMMENT 'Total duration in milliseconds',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_suite_name (suite_name),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Test suite results junction table
CREATE TABLE IF NOT EXISTS test_suite_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_suite_id INT NOT NULL,
  test_result_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_suite_id) REFERENCES test_suites(id) ON DELETE CASCADE,
  FOREIGN KEY (test_result_id) REFERENCES test_results(id) ON DELETE CASCADE,
  UNIQUE KEY unique_suite_result (test_suite_id, test_result_id),
  INDEX idx_test_suite_id (test_suite_id),
  INDEX idx_test_result_id (test_result_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for demonstration
INSERT IGNORE INTO users (name, email, password, avatar) VALUES 
('Demo User', 'demo@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'https://i.pravatar.cc/150?img=68'),
('Test Admin', 'admin@autotest.ai', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'https://i.pravatar.cc/150?img=12');

-- Note: The password for both demo accounts is 'password'