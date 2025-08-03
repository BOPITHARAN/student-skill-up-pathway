const { pool } = require('../config/database');
const { 
  formatResponse, 
  getPagination, 
  getPaginationMeta,
  logError,
  logInfo
} = require('../utils/helpers');

// Create payment intent (Stripe simulation)
const createPayment = async (req, res) => {
  try {
    const { amount, payment_method = 'stripe' } = req.body;
    const userId = req.user.id;

    // Check if user already paid
    const [existingPayments] = await pool.execute(
      'SELECT id FROM payments WHERE user_id = ? AND status = "completed"',
      [userId]
    );

    if (existingPayments.length > 0) {
      return res.status(400).json(
        formatResponse(false, 'User has already made a payment')
      );
    }

    // Create payment record
    const [result] = await pool.execute(
      'INSERT INTO payments (user_id, amount, status, payment_method) VALUES (?, ?, ?, ?)',
      [userId, amount, 'pending', payment_method]
    );

    // In a real application, you would integrate with Stripe here
    // For demo purposes, we'll simulate the payment process
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
    };

    // Update payment with transaction ID
    await pool.execute(
      'UPDATE payments SET transaction_id = ? WHERE id = ?',
      [paymentIntent.id, result.insertId]
    );

    logInfo('Payment created', { paymentId: result.insertId, userId, amount });

    res.status(201).json(
      formatResponse(true, 'Payment created successfully', {
        paymentId: result.insertId,
        paymentIntent
      })
    );
  } catch (error) {
    logError(error, 'Create payment controller');
    res.status(500).json(
      formatResponse(false, 'Failed to create payment')
    );
  }
};

// Confirm payment (simulate successful payment)
const confirmPayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    const userId = req.user.id;

    // Get payment record
    const [payments] = await pool.execute(
      'SELECT * FROM payments WHERE id = ? AND user_id = ?',
      [paymentId, userId]
    );

    if (payments.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Payment not found')
      );
    }

    const payment = payments[0];

    if (payment.status === 'completed') {
      return res.status(400).json(
        formatResponse(false, 'Payment already completed')
      );
    }

    // Update payment status
    await pool.execute(
      'UPDATE payments SET status = ?, transaction_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['completed', transactionId || payment.transaction_id, paymentId]
    );

    // Update user's paid status
    await pool.execute(
      'UPDATE users SET paid = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );

    logInfo('Payment confirmed', { paymentId, userId, amount: payment.amount });

    res.json(
      formatResponse(true, 'Payment confirmed successfully', {
        paymentId,
        amount: payment.amount,
        status: 'completed'
      })
    );
  } catch (error) {
    logError(error, 'Confirm payment controller');
    res.status(500).json(
      formatResponse(false, 'Failed to confirm payment')
    );
  }
};

// Get user's payment history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM payments WHERE user_id = ?',
      [userId]
    );
    const total = countResult[0].total;

    // Get payments
    const [payments] = await pool.execute(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, queryLimit, offset]
    );

    const meta = getPaginationMeta(page, queryLimit, total);

    res.json(
      formatResponse(true, 'Payment history retrieved successfully', payments, meta)
    );
  } catch (error) {
    logError(error, 'Get payment history controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve payment history')
    );
  }
};

// Get all payments (Admin only)
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build WHERE clause
    const conditions = [];
    const values = [];

    if (status) {
      conditions.push('p.status = ?');
      values.push(status);
    }

    if (userId) {
      conditions.push('p.user_id = ?');
      values.push(userId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM payments p ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // Get payments with user info
    const [payments] = await pool.execute(
      `SELECT 
        p.*,
        u.name as user_name,
        u.email as user_email
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?`,
      [...values, queryLimit, offset]
    );

    const meta = getPaginationMeta(page, queryLimit, total);

    res.json(
      formatResponse(true, 'Payments retrieved successfully', payments, meta)
    );
  } catch (error) {
    logError(error, 'Get all payments controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve payments')
    );
  }
};

// Get payment statistics (Admin only)
const getPaymentStats = async (req, res) => {
  try {
    // Total revenue
    const [totalRevenue] = await pool.execute(
      'SELECT SUM(amount) as total FROM payments WHERE status = "completed"'
    );

    // Revenue by month (last 12 months)
    const [monthlyRevenue] = await pool.execute(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as revenue,
        COUNT(*) as payment_count
      FROM payments 
      WHERE status = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC`
    );

    // Payment status distribution
    const [statusDistribution] = await pool.execute(
      `SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM payments 
      GROUP BY status`
    );

    // Payment method distribution
    const [methodDistribution] = await pool.execute(
      `SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM payments 
      WHERE status = 'completed'
      GROUP BY payment_method`
    );

    // Recent payments
    const [recentPayments] = await pool.execute(
      `SELECT 
        p.*,
        u.name as user_name,
        u.email as user_email
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 10`
    );

    const stats = {
      totalRevenue: totalRevenue[0].total || 0,
      monthlyRevenue,
      statusDistribution,
      methodDistribution,
      recentPayments
    };

    res.json(
      formatResponse(true, 'Payment statistics retrieved successfully', stats)
    );
  } catch (error) {
    logError(error, 'Get payment stats controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve payment statistics')
    );
  }
};

// Refund payment (Admin only)
const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Get payment
    const [payments] = await pool.execute(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );

    if (payments.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Payment not found')
      );
    }

    const payment = payments[0];

    if (payment.status !== 'completed') {
      return res.status(400).json(
        formatResponse(false, 'Can only refund completed payments')
      );
    }

    // Update payment status
    await pool.execute(
      'UPDATE payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['refunded', id]
    );

    // Update user's paid status
    await pool.execute(
      'UPDATE users SET paid = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [payment.user_id]
    );

    // In a real application, you would process the actual refund with Stripe here

    logInfo('Payment refunded', { paymentId: id, userId: payment.user_id, reason });

    res.json(
      formatResponse(true, 'Payment refunded successfully', {
        paymentId: id,
        amount: payment.amount,
        status: 'refunded'
      })
    );
  } catch (error) {
    logError(error, 'Refund payment controller');
    res.status(500).json(
      formatResponse(false, 'Failed to refund payment')
    );
  }
};

module.exports = {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getAllPayments,
  getPaymentStats,
  refundPayment
};