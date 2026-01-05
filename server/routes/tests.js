const express = require('express');
const TestResult = require('../models/TestResult');
const HealingAction = require('../models/HealingAction');
const FlakyTest = require('../models/FlakyTest');
const { authenticateToken } = require('../middleware/auth');
const { generateTestsForUrl } = require('../services/testGenerationService');

const router = express.Router();

// Create new test result
router.post('/results', authenticateToken, async (req, res) => {
  try {
    const { test_name, test_url, status, duration, error_message, test_logs } = req.body;

    // Validate required fields
    if (!test_name || !test_url || !status) {
      return res.status(400).json({
        success: false,
        message: 'Test name, URL, and status are required'
      });
    }

    const testResult = await TestResult.create({
      user_id: req.user.id,
      test_name,
      test_url,
      status,
      duration: duration || 0,
      error_message,
      test_logs
    });

    res.status(201).json({
      success: true,
      message: 'Test result created successfully',
      data: { testResult }
    });
  } catch (error) {
    console.error('Test result creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test result'
    });
  }
});

// Get test results for user
router.get('/results', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const testResults = await TestResult.findByUserId(
      req.user.id, 
      parseInt(limit), 
      parseInt(offset)
    );

    res.json({
      success: true,
      data: { testResults }
    });
  } catch (error) {
    console.error('Get test results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test results'
    });
  }
});

// Get test statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const [stats, dailyStats] = await Promise.all([
      TestResult.getStatsByUserId(req.user.id, parseInt(days)),
      TestResult.getDailyStats(req.user.id, parseInt(days))
    ]);

    res.json({
      success: true,
      data: { stats, dailyStats }
    });
  } catch (error) {
    console.error('Get test stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test statistics'
    });
  }
});

// Create healing action
router.post('/healing', authenticateToken, async (req, res) => {
  try {
    const { 
      test_result_id, 
      element_type, 
      old_selector, 
      new_selector, 
      confidence, 
      status, 
      healing_logs 
    } = req.body;

    const healingAction = await HealingAction.create({
      user_id: req.user.id,
      test_result_id,
      element_type,
      old_selector,
      new_selector,
      confidence,
      status: status || 'pending',
      healing_logs
    });

    res.status(201).json({
      success: true,
      message: 'Healing action created successfully',
      data: { healingAction }
    });
  } catch (error) {
    console.error('Healing action creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create healing action'
    });
  }
});

// Get healing actions for user
router.get('/healing', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const healingActions = await HealingAction.findByUserId(
      req.user.id, 
      parseInt(limit), 
      parseInt(offset)
    );

    res.json({
      success: true,
      data: { healingActions }
    });
  } catch (error) {
    console.error('Get healing actions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get healing actions'
    });
  }
});

// Get healing statistics
router.get('/healing/stats', authenticateToken, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const stats = await HealingAction.getStatsByUserId(req.user.id, parseInt(days));

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get healing stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get healing statistics'
    });
  }
});

// Create or update flaky test
router.post('/flaky', authenticateToken, async (req, res) => {
  try {
    const { 
      test_name, 
      test_url, 
      failure_rate, 
      total_runs, 
      failed_runs, 
      last_failure, 
      priority, 
      pattern_analysis 
    } = req.body;

    const flakyTest = await FlakyTest.createOrUpdate({
      user_id: req.user.id,
      test_name,
      test_url,
      failure_rate,
      total_runs,
      failed_runs,
      last_failure,
      priority: priority || 'medium',
      pattern_analysis
    });

    res.status(201).json({
      success: true,
      message: 'Flaky test record updated successfully',
      data: { flakyTest }
    });
  } catch (error) {
    console.error('Flaky test creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update flaky test'
    });
  }
});

// Get flaky tests for user
router.get('/flaky', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const flakyTests = await FlakyTest.findByUserId(
      req.user.id, 
      parseInt(limit), 
      parseInt(offset)
    );

    res.json({
      success: true,
      data: { flakyTests }
    });
  } catch (error) {
    console.error('Get flaky tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get flaky tests'
    });
  }
});

// Get flaky test trends
router.get('/flaky/trends', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const trends = await FlakyTest.getTrendsByUserId(req.user.id, parseInt(days));

    res.json({
      success: true,
      data: { trends }
    });
  } catch (error) {
    console.error('Get flaky test trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get flaky test trends'
    });
  }
});

module.exports = router;

// Generate tests for a given URL
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { url, framework = 'playwright', options } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, message: 'url is required' });
    }

    const result = await generateTestsForUrl({
      url,
      userId: req.user.id,
      framework,
      options: options || {}
    });

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Test generation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate tests' });
  }
});