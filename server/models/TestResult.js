const { pool } = require('../config/database');

class TestResult {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.test_name = data.test_name;
    this.test_url = data.test_url;
    this.status = data.status;
    this.duration = data.duration;
    this.error_message = data.error_message;
    this.test_logs = data.test_logs;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new test result
  static async create(testData) {
    const { user_id, test_name, test_url, status, duration, error_message, test_logs } = testData;
    
    try {
      const [result] = await pool.execute(
        `INSERT INTO test_results 
         (user_id, test_name, test_url, status, duration, error_message, test_logs) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, test_name, test_url, status, duration, error_message, test_logs]
      );
      
      return await TestResult.findById(result.insertId);
    } catch (error) {
      throw new Error(`Failed to create test result: ${error.message}`);
    }
  }

  // Find test result by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM test_results WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new TestResult(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find test result: ${error.message}`);
    }
  }

  // Get all test results for a user
  static async findByUserId(userId, limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM test_results 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      
      return rows.map(row => new TestResult(row));
    } catch (error) {
      throw new Error(`Failed to find test results: ${error.message}`);
    }
  }

  // Get test statistics for a user
  static async getStatsByUserId(userId, days = 7) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           status,
           COUNT(*) as count,
           AVG(duration) as avg_duration
         FROM test_results 
         WHERE user_id = ? 
           AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY status`,
        [userId, days]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Failed to get test statistics: ${error.message}`);
    }
  }

  // Get daily test counts for charts
  static async getDailyStats(userId, days = 7) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           DATE(created_at) as test_date,
           status,
           COUNT(*) as count
         FROM test_results 
         WHERE user_id = ? 
           AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY DATE(created_at), status
         ORDER BY test_date DESC`,
        [userId, days]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Failed to get daily statistics: ${error.message}`);
    }
  }

  // Update test result
  async update(updateData) {
    const { status, duration, error_message, test_logs } = updateData;
    
    try {
      await pool.execute(
        `UPDATE test_results 
         SET status = ?, duration = ?, error_message = ?, test_logs = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [status, duration, error_message, test_logs, this.id]
      );
      
      return await TestResult.findById(this.id);
    } catch (error) {
      throw new Error(`Failed to update test result: ${error.message}`);
    }
  }
}

module.exports = TestResult;