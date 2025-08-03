const express = require('express');
const router = express.Router();
const { 
  createPayment, 
  confirmPayment, 
  getPaymentHistory, 
  getAllPayments, 
  getPaymentStats,
  refundPayment
} = require('../controllers/paymentController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validatePayment, validateId, validatePagination } = require('../middleware/validation');

/**
 * @route   POST /api/payments/create
 * @desc    Create payment intent
 * @access  Private
 */
router.post('/create', authenticateToken, validatePayment, createPayment);

/**
 * @route   POST /api/payments/confirm
 * @desc    Confirm payment
 * @access  Private
 */
router.post('/confirm', authenticateToken, confirmPayment);

/**
 * @route   GET /api/payments/history
 * @desc    Get user's payment history
 * @access  Private
 */
router.get('/history', authenticateToken, validatePagination, getPaymentHistory);

/**
 * @route   GET /api/payments
 * @desc    Get all payments
 * @access  Private (Admin only)
 */
router.get('/', authenticateToken, requireAdmin, validatePagination, getAllPayments);

/**
 * @route   GET /api/payments/stats
 * @desc    Get payment statistics
 * @access  Private (Admin only)
 */
router.get('/stats', authenticateToken, requireAdmin, getPaymentStats);

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Refund payment
 * @access  Private (Admin only)
 */
router.post('/:id/refund', authenticateToken, requireAdmin, validateId, refundPayment);

module.exports = router;