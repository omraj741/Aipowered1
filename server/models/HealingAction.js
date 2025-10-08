const { pool } = require('../config/database');

class HealingAction {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.test_result_id = data.test_result_id;
    this.element_type = data.element_type;
    this.old_selector = data.old_selector;
    this.new_selector = data.new_selector;
    this.confidence = data.confidence;
    this.status = data.status;
    this.healing_logs = data.healing_logs;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new healing action
  static async create(healingData) {
    const { 
      user_id, 
      test_result_id, 
      element_type, 
      old_selector, 
      new_selector, 
      confidence, 
      status, 
      healing_logs 
    } = healingData;
    
    try {
      const [result] = await pool.execute(
        `INSERT INTO healing_actions 
         (user_id, test_result_id, element_type, old_selector, new_selector, confidence, status, healing_logs) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, test_result_id, element_type, old_selector, new_selector, confidence, status, healing_logs]
      );
      
      return await HealingAction.findById(result.insertId);
    } catch (error) {
      throw new Error(`Failed to create healing action: ${error.message}`);
    }
  }

  // Find healing action by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM healing_actions WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new HealingAction(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find healing action: ${error.message}`);
    }
  }

  // Get all healing actions for a user
  static async findByUserId(userId, limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        `SELECT ha.*, tr.test_name 
         FROM healing_actions ha
         LEFT JOIN test_results tr ON ha.test_result_id = tr.id
         WHERE ha.user_id = ? 
         ORDER BY ha.created_at DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      
      return rows.map(row => new HealingAction(row));
    } catch (error) {
      throw new Error(`Failed to find healing actions: ${error.message}`);
    }
  }

  // Get healing statistics
  static async getStatsByUserId(userId, days = 7) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           status,
           COUNT(*) as count,
           AVG(confidence) as avg_confidence
         FROM healing_actions 
         WHERE user_id = ? 
           AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY status`,
        [userId, days]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Failed to get healing statistics: ${error.message}`);
    }
  }

  // Update healing action status
  async updateStatus(status, healing_logs = null) {
    try {
      await pool.execute(
        `UPDATE healing_actions 
         SET status = ?, healing_logs = COALESCE(?, healing_logs), updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [status, healing_logs, this.id]
      );
      
      return await HealingAction.findById(this.id);
    } catch (error) {
      throw new Error(`Failed to update healing action: ${error.message}`);
    }
  }
}

module.exports = HealingAction;