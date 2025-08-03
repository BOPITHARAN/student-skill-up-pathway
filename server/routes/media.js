const express = require('express');
const router = express.Router();
const { 
  getCourseMedia, 
  addMedia, 
  updateMedia, 
  deleteMedia, 
  reorderMedia,
  uploadMedia
} = require('../controllers/mediaController');
const { authenticateToken, requireAdmin, requirePayment } = require('../middleware/auth');
const { validateMedia, validateId } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

/**
 * @route   GET /api/media/course/:courseId
 * @desc    Get media for a course
 * @access  Private (Paid users only)
 */
router.get('/course/:courseId', authenticateToken, requirePayment, validateId, getCourseMedia);

/**
 * @route   POST /api/media/course/:courseId
 * @desc    Add media to course (URL-based)
 * @access  Private (Admin only)
 */
router.post('/course/:courseId', authenticateToken, requireAdmin, validateId, validateMedia, addMedia);

/**
 * @route   POST /api/media/course/:courseId/upload
 * @desc    Upload file and add media to course
 * @access  Private (Admin only)
 */
router.post('/course/:courseId/upload', 
  authenticateToken, 
  requireAdmin, 
  validateId,
  upload.single('file'),
  handleUploadError,
  uploadMedia
);

/**
 * @route   PUT /api/media/:id
 * @desc    Update media
 * @access  Private (Admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, validateId, updateMedia);

/**
 * @route   DELETE /api/media/:id
 * @desc    Delete media
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, validateId, deleteMedia);

/**
 * @route   PUT /api/media/course/:courseId/reorder
 * @desc    Reorder media in course
 * @access  Private (Admin only)
 */
router.put('/course/:courseId/reorder', authenticateToken, requireAdmin, validateId, reorderMedia);

module.exports = router;