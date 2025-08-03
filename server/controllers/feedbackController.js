const { pool } = require('../config/database');
const { 
  formatResponse, 
  getPagination, 
  getPaginationMeta,
  logError,
  logInfo
} = require('../utils/helpers');

// Submit feedback for a course
const submitFeedback = async (req, res) => {
  try {
    const { courseId, comment, rating } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id, title FROM courses WHERE id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Course not found')
      );
    }

    // Check if user is enrolled in the course
    const [enrollments] = await pool.execute(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length === 0) {
      return res.status(403).json(
        formatResponse(false, 'You must be enrolled in this course to leave feedback')
      );
    }

    // Check if user already submitted feedback for this course
    const [existingFeedback] = await pool.execute(
      'SELECT id FROM feedback WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (existingFeedback.length > 0) {
      return res.status(400).json(
        formatResponse(false, 'You have already submitted feedback for this course')
      );
    }

    // Create feedback
    const [result] = await pool.execute(
      'INSERT INTO feedback (user_id, course_id, comment, rating) VALUES (?, ?, ?, ?)',
      [userId, courseId, comment, rating]
    );

    // Update course rating
    const [avgRating] = await pool.execute(
      'SELECT AVG(rating) as avg_rating FROM feedback WHERE course_id = ?',
      [courseId]
    );

    await pool.execute(
      'UPDATE courses SET rating = ? WHERE id = ?',
      [parseFloat(avgRating[0].avg_rating).toFixed(1), courseId]
    );

    // Get created feedback with user info
    const [feedback] = await pool.execute(
      `SELECT 
        f.*,
        u.name as user_name,
        u.avatar as user_avatar,
        c.title as course_title
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      JOIN courses c ON f.course_id = c.id
      WHERE f.id = ?`,
      [result.insertId]
    );

    logInfo('Feedback submitted', { feedbackId: result.insertId, userId, courseId, rating });

    res.status(201).json(
      formatResponse(true, 'Feedback submitted successfully', feedback[0])
    );
  } catch (error) {
    logError(error, 'Submit feedback controller');
    res.status(500).json(
      formatResponse(false, 'Failed to submit feedback')
    );
  }
};

// Get feedback for a course
const getCourseFeedback = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Course not found')
      );
    }

    // Build WHERE clause
    let whereClause = 'WHERE f.course_id = ?';
    const values = [courseId];

    if (rating) {
      whereClause += ' AND f.rating = ?';
      values.push(rating);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM feedback f ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // Get feedback with user info
    const [feedback] = await pool.execute(
      `SELECT 
        f.*,
        u.name as user_name,
        u.avatar as user_avatar
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      ${whereClause}
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?`,
      [...values, queryLimit, offset]
    );

    // Get rating distribution
    const [ratingDistribution] = await pool.execute(
      `SELECT 
        rating,
        COUNT(*) as count
      FROM feedback 
      WHERE course_id = ?
      GROUP BY rating
      ORDER BY rating DESC`,
      [courseId]
    );

    // Calculate average rating
    const [avgRating] = await pool.execute(
      'SELECT AVG(rating) as avg_rating FROM feedback WHERE course_id = ?',
      [courseId]
    );

    const meta = getPaginationMeta(page, queryLimit, total);

    const responseData = {
      feedback,
      statistics: {
        averageRating: avgRating[0].avg_rating ? parseFloat(avgRating[0].avg_rating).toFixed(1) : '0.0',
        totalReviews: total,
        ratingDistribution
      }
    };

    res.json(
      formatResponse(true, 'Course feedback retrieved successfully', responseData, meta)
    );
  } catch (error) {
    logError(error, 'Get course feedback controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve course feedback')
    );
  }
};

// Get user's feedback
const getUserFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM feedback WHERE user_id = ?',
      [userId]
    );
    const total = countResult[0].total;

    // Get user's feedback
    const [feedback] = await pool.execute(
      `SELECT 
        f.*,
        c.title as course_title,
        c.category as course_category,
        c.image as course_image
      FROM feedback f
      JOIN courses c ON f.course_id = c.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?`,
      [userId, queryLimit, offset]
    );

    const meta = getPaginationMeta(page, queryLimit, total);

    res.json(
      formatResponse(true, 'User feedback retrieved successfully', feedback, meta)
    );
  } catch (error) {
    logError(error, 'Get user feedback controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve user feedback')
    );
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user.id;

    // Check if feedback exists and belongs to user
    const [existingFeedback] = await pool.execute(
      'SELECT * FROM feedback WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingFeedback.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Feedback not found or you do not have permission to update it')
      );
    }

    // Build update query
    const updates = [];
    const values = [];

    if (comment !== undefined) {
      updates.push('comment = ?');
      values.push(comment);
    }

    if (rating !== undefined) {
      updates.push('rating = ?');
      values.push(rating);
    }

    if (updates.length === 0) {
      return res.status(400).json(
        formatResponse(false, 'No valid fields to update')
      );
    }

    values.push(id);

    await pool.execute(
      `UPDATE feedback SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Update course rating if rating was changed
    if (rating !== undefined) {
      const courseId = existingFeedback[0].course_id;
      const [avgRating] = await pool.execute(
        'SELECT AVG(rating) as avg_rating FROM feedback WHERE course_id = ?',
        [courseId]
      );

      await pool.execute(
        'UPDATE courses SET rating = ? WHERE id = ?',
        [parseFloat(avgRating[0].avg_rating).toFixed(1), courseId]
      );
    }

    // Get updated feedback
    const [feedback] = await pool.execute(
      `SELECT 
        f.*,
        u.name as user_name,
        u.avatar as user_avatar,
        c.title as course_title
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      JOIN courses c ON f.course_id = c.id
      WHERE f.id = ?`,
      [id]
    );

    logInfo('Feedback updated', { feedbackId: id, userId });

    res.json(
      formatResponse(true, 'Feedback updated successfully', feedback[0])
    );
  } catch (error) {
    logError(error, 'Update feedback controller');
    res.status(500).json(
      formatResponse(false, 'Failed to update feedback')
    );
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Check if feedback exists
    const [existingFeedback] = await pool.execute(
      'SELECT * FROM feedback WHERE id = ?',
      [id]
    );

    if (existingFeedback.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Feedback not found')
      );
    }

    // Check permission (user can delete their own feedback, admin can delete any)
    if (!isAdmin && existingFeedback[0].user_id !== userId) {
      return res.status(403).json(
        formatResponse(false, 'You do not have permission to delete this feedback')
      );
    }

    const courseId = existingFeedback[0].course_id;

    // Delete feedback
    await pool.execute('DELETE FROM feedback WHERE id = ?', [id]);

    // Update course rating
    const [avgRating] = await pool.execute(
      'SELECT AVG(rating) as avg_rating FROM feedback WHERE course_id = ?',
      [courseId]
    );

    const newRating = avgRating[0].avg_rating ? parseFloat(avgRating[0].avg_rating).toFixed(1) : '0.0';
    await pool.execute(
      'UPDATE courses SET rating = ? WHERE id = ?',
      [newRating, courseId]
    );

    logInfo('Feedback deleted', { feedbackId: id, deletedBy: userId, isAdmin });

    res.json(
      formatResponse(true, 'Feedback deleted successfully')
    );
  } catch (error) {
    logError(error, 'Delete feedback controller');
    res.status(500).json(
      formatResponse(false, 'Failed to delete feedback')
    );
  }
};

module.exports = {
  submitFeedback,
  getCourseFeedback,
  getUserFeedback,
  updateFeedback,
  deleteFeedback
};