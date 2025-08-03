const { pool } = require('../config/database');
const { 
  formatResponse, 
  getPagination, 
  getPaginationMeta,
  sanitizeUser,
  logError,
  logInfo
} = require('../utils/helpers');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const [totalUsers] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "student"'
    );

    // Get paid users
    const [paidUsers] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "student" AND paid = TRUE'
    );

    // Get total courses
    const [totalCourses] = await pool.execute(
      'SELECT COUNT(*) as count FROM courses'
    );

    // Get total enrollments
    const [totalEnrollments] = await pool.execute(
      'SELECT COUNT(*) as count FROM enrollments'
    );

    // Get total revenue
    const [totalRevenue] = await pool.execute(
      'SELECT SUM(amount) as total FROM payments WHERE status = "completed"'
    );

    // Get recent registrations (last 30 days)
    const [recentRegistrations] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    // Get course completion rate
    const [completionStats] = await pool.execute(
      `SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(*) as total
      FROM enrollments`
    );

    const completionRate = completionStats[0].total > 0 
      ? Math.round((completionStats[0].completed / completionStats[0].total) * 100)
      : 0;

    // Get popular courses
    const [popularCourses] = await pool.execute(
      `SELECT 
        c.id,
        c.title,
        c.category,
        COUNT(e.id) as enrollment_count,
        AVG(f.rating) as avg_rating
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN feedback f ON c.id = f.course_id
      GROUP BY c.id
      ORDER BY enrollment_count DESC
      LIMIT 5`
    );

    const stats = {
      totalStudents: totalUsers[0].count,
      paidStudents: paidUsers[0].count,
      unpaidStudents: totalUsers[0].count - paidUsers[0].count,
      totalCourses: totalCourses[0].count,
      totalEnrollments: totalEnrollments[0].count,
      totalRevenue: totalRevenue[0].total || 0,
      recentRegistrations: recentRegistrations[0].count,
      completionRate,
      popularCourses: popularCourses.map(course => ({
        ...course,
        avg_rating: course.avg_rating ? parseFloat(course.avg_rating).toFixed(1) : '0.0'
      }))
    };

    res.json(
      formatResponse(true, 'Dashboard statistics retrieved successfully', stats)
    );
  } catch (error) {
    logError(error, 'Get dashboard stats controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve dashboard statistics')
    );
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, paid } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build WHERE clause
    const conditions = ['role = "student"'];
    const values = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      const searchTerm = `%${search}%`;
      values.push(searchTerm, searchTerm);
    }

    if (paid !== undefined) {
      conditions.push('paid = ?');
      values.push(paid === 'true');
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // Get students with enrollment stats
    const [students] = await pool.execute(
      `SELECT 
        u.*,
        COUNT(e.id) as total_enrollments,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses,
        COUNT(CASE WHEN e.status = 'in_progress' THEN 1 END) as in_progress_courses,
        MAX(p.created_at) as last_payment_date,
        SUM(p.amount) as total_paid
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'completed'
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?`,
      [...values, queryLimit, offset]
    );

    const sanitizedStudents = students.map(student => ({
      ...sanitizeUser(student),
      total_paid: student.total_paid || 0
    }));

    const meta = getPaginationMeta(page, queryLimit, total);

    res.json(
      formatResponse(true, 'Students retrieved successfully', sanitizedStudents, meta)
    );
  } catch (error) {
    logError(error, 'Get students controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve students')
    );
  }
};

// Get student details
const getStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Get student info
    const [students] = await pool.execute(
      `SELECT 
        u.*,
        COUNT(e.id) as total_enrollments,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses,
        COUNT(CASE WHEN e.status = 'in_progress' THEN 1 END) as in_progress_courses,
        SUM(p.amount) as total_paid
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'completed'
      WHERE u.id = ? AND u.role = 'student'
      GROUP BY u.id`,
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Student not found')
      );
    }

    // Get student's enrollments
    const [enrollments] = await pool.execute(
      `SELECT 
        e.*,
        c.title as course_title,
        c.category,
        c.image
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC`,
      [id]
    );

    // Get student's payments
    const [payments] = await pool.execute(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );

    // Get student's feedback
    const [feedback] = await pool.execute(
      `SELECT 
        f.*,
        c.title as course_title
      FROM feedback f
      JOIN courses c ON f.course_id = c.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC`,
      [id]
    );

    const studentData = {
      ...sanitizeUser(students[0]),
      total_paid: students[0].total_paid || 0,
      enrollments,
      payments,
      feedback
    };

    res.json(
      formatResponse(true, 'Student details retrieved successfully', studentData)
    );
  } catch (error) {
    logError(error, 'Get student controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve student details')
    );
  }
};

// Update student (Admin only)
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if student exists
    const [existingStudents] = await pool.execute(
      'SELECT id FROM users WHERE id = ? AND role = "student"',
      [id]
    );

    if (existingStudents.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Student not found')
      );
    }

    // Build update query
    const allowedFields = ['name', 'email', 'paid', 'avatar'];
    const updateFields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json(
        formatResponse(false, 'No valid fields to update')
      );
    }

    values.push(id);

    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    // Get updated student
    const [students] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    logInfo('Student updated by admin', { studentId: id, updatedFields: Object.keys(updates) });

    res.json(
      formatResponse(true, 'Student updated successfully', sanitizeUser(students[0]))
    );
  } catch (error) {
    logError(error, 'Update student controller');
    res.status(500).json(
      formatResponse(false, 'Failed to update student')
    );
  }
};

// Delete student (Admin only)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const [existingStudents] = await pool.execute(
      'SELECT id, name, email FROM users WHERE id = ? AND role = "student"',
      [id]
    );

    if (existingStudents.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Student not found')
      );
    }

    // Delete student (CASCADE will handle related records)
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    logInfo('Student deleted by admin', { 
      studentId: id, 
      name: existingStudents[0].name, 
      email: existingStudents[0].email 
    });

    res.json(
      formatResponse(true, 'Student deleted successfully')
    );
  } catch (error) {
    logError(error, 'Delete student controller');
    res.status(500).json(
      formatResponse(false, 'Failed to delete student')
    );
  }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 20, courseId, rating } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build WHERE clause
    const conditions = [];
    const values = [];

    if (courseId) {
      conditions.push('f.course_id = ?');
      values.push(courseId);
    }

    if (rating) {
      conditions.push('f.rating = ?');
      values.push(rating);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM feedback f ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // Get feedback with user and course info
    const [feedback] = await pool.execute(
      `SELECT 
        f.*,
        u.name as user_name,
        u.email as user_email,
        u.avatar as user_avatar,
        c.title as course_title,
        c.category as course_category
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      JOIN courses c ON f.course_id = c.id
      ${whereClause}
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?`,
      [...values, queryLimit, offset]
    );

    const meta = getPaginationMeta(page, queryLimit, total);

    res.json(
      formatResponse(true, 'Feedback retrieved successfully', feedback, meta)
    );
  } catch (error) {
    logError(error, 'Get all feedback controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve feedback')
    );
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get recent enrollments
    const [enrollments] = await pool.execute(
      `SELECT 
        'enrollment' as type,
        e.enrolled_at as created_at,
        u.name as user_name,
        c.title as course_title,
        e.status
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrolled_at DESC
      LIMIT ?`,
      [Math.floor(limit / 3)]
    );

    // Get recent payments
    const [payments] = await pool.execute(
      `SELECT 
        'payment' as type,
        p.created_at,
        u.name as user_name,
        p.amount,
        p.status
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ?`,
      [Math.floor(limit / 3)]
    );

    // Get recent feedback
    const [feedback] = await pool.execute(
      `SELECT 
        'feedback' as type,
        f.created_at,
        u.name as user_name,
        c.title as course_title,
        f.rating
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      JOIN courses c ON f.course_id = c.id
      ORDER BY f.created_at DESC
      LIMIT ?`,
      [Math.floor(limit / 3)]
    );

    // Combine and sort all activities
    const allActivities = [...enrollments, ...payments, ...feedback]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    res.json(
      formatResponse(true, 'Recent activity retrieved successfully', allActivities)
    );
  } catch (error) {
    logError(error, 'Get recent activity controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve recent activity')
    );
  }
};

module.exports = {
  getDashboardStats,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getAllFeedback,
  getRecentActivity
};