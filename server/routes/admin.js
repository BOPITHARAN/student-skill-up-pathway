const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getStudents, 
  getStudent, 
  updateStudent, 
  deleteStudent, 
  getAllFeedback,
  getRecentActivity
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateId, validatePagination } = require('../middleware/validation');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/dashboard', authenticateToken, requireAdmin, getDashboardStats);

/**
 * @route   GET /api/admin/students
 * @desc    Get all students
 * @access  Private (Admin only)
 */
router.get('/students', authenticateToken, requireAdmin, validatePagination, getStudents);

/**
 * @route   GET /api/admin/students/:id
 * @desc    Get student details
 * @access  Private (Admin only)
 */
router.get('/students/:id', authenticateToken, requireAdmin, validateId, getStudent);

/**
 * @route   PUT /api/admin/students/:id
 * @desc    Update student
 * @access  Private (Admin only)
 */
router.put('/students/:id', authenticateToken, requireAdmin, validateId, updateStudent);

/**
 * @route   DELETE /api/admin/students/:id
 * @desc    Delete student
 * @access  Private (Admin only)
 */
router.delete('/students/:id', authenticateToken, requireAdmin, validateId, deleteStudent);

/**
 * @route   GET /api/admin/feedback
 * @desc    Get all feedback
 * @access  Private (Admin only)
 */
router.get('/feedback', authenticateToken, requireAdmin, validatePagination, getAllFeedback);

/**
 * @route   GET /api/admin/activity
 * @desc    Get recent activity
 * @access  Private (Admin only)
 */
router.get('/activity', authenticateToken, requireAdmin, getRecentActivity);

module.exports = router;