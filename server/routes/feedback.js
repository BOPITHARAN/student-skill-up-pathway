const express = require('express');
const router = express.Router();
const { 
  submitFeedback, 
  getCourseFeedback, 
  getUserFeedback, 
  updateFeedback, 
  deleteFeedback 
} = require('../controllers/feedbackController');
const { authenticateToken, requirePayment } = require('../middleware/auth');
const { validateFeedback, validateId, validatePagination } = require('../middleware/validation');

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback for a course
 * @access  Private (Paid users only)
 */
router.post('/', authenticateToken, requirePayment, validateFeedback, submitFeedback);

/**
 * @route   GET /api/feedback/course/:courseId
 * @desc    Get feedback for a course
 * @access  Public
 */
router.get('/course/:courseId', validateId, validatePagination, getCourseFeedback);

/**
 * @route   GET /api/feedback/user
 * @desc    Get user's feedback
 * @access  Private
 */
router.get('/user', authenticateToken, validatePagination, getUserFeedback);

/**
 * @route   PUT /api/feedback/:id
 * @desc    Update feedback
 * @access  Private
 */
router.put('/:id', authenticateToken, validateId, validateFeedback, updateFeedback);

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Delete feedback
 * @access  Private
 */
router.delete('/:id', authenticateToken, validateId, deleteFeedback);

module.exports = router;