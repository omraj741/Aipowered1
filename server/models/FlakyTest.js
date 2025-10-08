const { pool } = require('../config/database');

class FlakyTest {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.test_name = data.test_name;
    this.test_url = data.test_url;
    this.failure_rate = data.failure_rate;
    this.total_runs = data.total_runs;
    this.failed_runs = data.failed_runs;
    this.last_failure = data.last_failure;
    this.priority = data.priority;
    this.pattern_analysis = data.pattern_analysis;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create or update flaky test
  static async createOrUpdate(flakyData) {
    const { 
      user_id, 
      test_name, 
      test_url, 
      failure_rate, 
      total_runs, 
      failed_runs, 
      last_failure, 
      priority, 
      pattern_analysis 
    } = flakyData;
    
    try {
      // Check if flaky test already exists
      const [existing] = await pool.execute(
        'SELECT id FROM flaky_tests WHERE user_id = ? AND test_name = ? AND test_url = ?',
        [user_id, test_name, test_url]
      );
      
      if (existing.length > 0) {
        // Update existing record
        await pool.execute(
          `UPDATE flaky_tests 
           SET failure_rate = ?, total_runs = ?, failed_runs = ?, 
               last_failure = ?, priority = ?, pattern_analysis = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [failure_rate, total_runs, failed_runs, last_failure, priority, pattern_analysis, existing[0].id]
        );
        
        return await FlakyTest.findById(existing[0].id);
      } else {
        // Create new record
        const [result] = await pool.execute(
          `INSERT INTO flaky_tests 
           (user_id, test_name, test_url, failure_rate, total_runs, failed_runs, last_failure, priority, pattern_analysis) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [user_id, test_name, test_url, failure_rate, total_runs, failed_runs, last_failure, priority, pattern_analysis]
        );
        
        return await FlakyTest.findById(result.insertId);
      }
    } catch (error) {
      throw new Error(`Failed to create/update flaky test: ${error.message}`);
    }
  }

  // Find flaky test by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM flaky_tests WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new FlakyTest(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find flaky test: ${error.message}`);
    }
  }

  // Get all flaky tests for a user
  static async findByUserId(userId, limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM flaky_tests 
         WHERE user_id = ? 
         ORDER BY failure_rate DESC, updated_at DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      
      return rows.map(row => new FlakyTest(row));
    } catch (error) {
      throw new Error(`Failed to find flaky tests: ${error.message}`);
    }
  }

  // Get flaky test trends
  static async getTrendsByUserId(userId, days = 30) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           DATE(updated_at) as date,
           COUNT(*) as flaky_count,
           AVG(failure_rate) as avg_failure_rate
         FROM flaky_tests 
         WHERE user_id = ? 
           AND updated_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY DATE(updated_at)
         ORDER BY date DESC`,
        [userId, days]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Failed to get flaky test trends: ${error.message}`);
    }
  }

  // Update priority
  async updatePriority(priority) {
    try {
      await pool.execute(
        'UPDATE flaky_tests SET priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [priority, this.id]
      );
      
      return await FlakyTest.findById(this.id);
    } catch (error) {
      throw new Error(`Failed to update flaky test priority: ${error.message}`);
    }
  }
}

module.exports = FlakyTest;