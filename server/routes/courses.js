const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourse, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  getCategories,
  enrollInCourse,
  getEnrolledCourses
} = require('../controllers/courseController');
const { authenticateToken, requireAdmin, requirePayment, optionalAuth } = require('../middleware/auth');
const { validateCourse, validateId, validatePagination } = require('../middleware/validation');

/**
 * @route   GET /api/courses
 * @desc    Get all courses (public with optional auth for personalization)
 * @access  Public
 */
router.get('/', validatePagination, optionalAuth, getCourses);

/**
 * @route   GET /api/courses/categories
 * @desc    Get course categories
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/courses/enrolled
 * @desc    Get user's enrolled courses
 * @access  Private (Paid users only)
 */
router.get('/enrolled', authenticateToken, requirePayment, validatePagination, getEnrolledCourses);

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course by ID
 * @access  Public
 */
router.get('/:id', validateId, optionalAuth, getCourse);

/**
 * @route   POST /api/courses
 * @desc    Create new course
 * @access  Private (Admin only)
 */
router.post('/', authenticateToken, requireAdmin, validateCourse, createCourse);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private (Admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, validateId, updateCourse);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, validateId, deleteCourse);

/**
 * @route   POST /api/courses/:id/enroll
 * @desc    Enroll in course
 * @access  Private (Paid users only)
 */
router.post('/:id/enroll', authenticateToken, requirePayment, validateId, enrollInCourse);

module.exports = router;