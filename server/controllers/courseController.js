const { pool } = require('../config/database');
const { 
  formatResponse, 
  getPagination, 
  getPaginationMeta,
  calculateCourseRating,
  logError,
  logInfo
} = require('../utils/helpers');

// Get all courses (public)
const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, level, search, featured } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build WHERE clause
    const conditions = [];
    const values = [];

    if (category && category !== 'all') {
      conditions.push('c.category = ?');
      values.push(category);
    }

    if (level && level !== 'all') {
      conditions.push('c.level = ?');
      values.push(level);
    }

    if (search) {
      conditions.push('(c.title LIKE ? OR c.description LIKE ? OR c.category LIKE ?)');
      const searchTerm = `%${search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    if (featured === 'true') {
      conditions.push('c.featured = TRUE');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM courses c ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // Get courses with pagination
    const [courses] = await pool.execute(
      `SELECT 
        c.*,
        COUNT(e.id) as enrolled_students,
        AVG(f.rating) as avg_rating,
        COUNT(f.id) as review_count
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN feedback f ON c.id = f.course_id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.featured DESC, c.created_at DESC
      LIMIT ? OFFSET ?`,
      [...values, queryLimit, offset]
    );

    // Format courses
    const formattedCourses = courses.map(course => ({
      ...course,
      rating: course.avg_rating ? parseFloat(course.avg_rating).toFixed(1) : '0.0',
      students: course.enrolled_students || 0,
      reviews: course.review_count || 0
    }));

    const meta = getPaginationMeta(page, queryLimit, total);

    res.json(
      formatResponse(true, 'Courses retrieved successfully', formattedCourses, meta)
    );
  } catch (error) {
    logError(error, 'Get courses controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve courses')
    );
  }
};

// Get single course by ID
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Get course with media
    const [courses] = await pool.execute(
      `SELECT 
        c.*,
        COUNT(DISTINCT e.id) as enrolled_students,
        AVG(f.rating) as avg_rating,
        COUNT(DISTINCT f.id) as review_count
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN feedback f ON c.id = f.course_id
      WHERE c.id = ?
      GROUP BY c.id`,
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Course not found')
      );
    }

    // Get course media
    const [media] = await pool.execute(
      'SELECT * FROM media WHERE course_id = ? ORDER BY order_index ASC, created_at ASC',
      [id]
    );

    // Get recent feedback
    const [feedback] = await pool.execute(
      `SELECT 
        f.*,
        u.name as user_name,
        u.avatar as user_avatar
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      WHERE f.course_id = ?
      ORDER BY f.created_at DESC
      LIMIT 10`,
      [id]
    );

    const course = {
      ...courses[0],
      rating: courses[0].avg_rating ? parseFloat(courses[0].avg_rating).toFixed(1) : '0.0',
      students: courses[0].enrolled_students || 0,
      reviews: courses[0].review_count || 0,
      media: media,
      feedback: feedback
    };

    res.json(
      formatResponse(true, 'Course retrieved successfully', course)
    );
  } catch (error) {
    logError(error, 'Get course controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve course')
    );
  }
};

// Create new course (Admin only)
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      hours = 0,
      topic_count = 0,
      instructor,
      level = 'Beginner',
      image,
      featured = false
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO courses (title, description, category, hours, topic_count, instructor, level, image, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category, hours, topic_count, instructor, level, image, featured]
    );

    // Get created course
    const [courses] = await pool.execute(
      'SELECT * FROM courses WHERE id = ?',
      [result.insertId]
    );

    logInfo('Course created successfully', { courseId: result.insertId, title });

    res.status(201).json(
      formatResponse(true, 'Course created successfully', courses[0])
    );
  } catch (error) {
    logError(error, 'Create course controller');
    res.status(500).json(
      formatResponse(false, 'Failed to create course')
    );
  }
};

// Update course (Admin only)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if course exists
    const [existingCourses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [id]
    );

    if (existingCourses.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Course not found')
      );
    }

    // Build update query
    const allowedFields = ['title', 'description', 'category', 'hours', 'topic_count', 'instructor', 'level', 'image', 'featured'];
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
      `UPDATE courses SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    // Get updated course
    const [courses] = await pool.execute(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );

    logInfo('Course updated successfully', { courseId: id });

    res.json(
      formatResponse(true, 'Course updated successfully', courses[0])
    );
  } catch (error) {
    logError(error, 'Update course controller');
    res.status(500).json(
      formatResponse(false, 'Failed to update course')
    );
  }
};

// Delete course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const [existingCourses] = await pool.execute(
      'SELECT id, title FROM courses WHERE id = ?',
      [id]
    );

    if (existingCourses.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Course not found')
      );
    }

    // Delete course (CASCADE will handle related records)
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);

    logInfo('Course deleted successfully', { courseId: id, title: existingCourses[0].title });

    res.json(
      formatResponse(true, 'Course deleted successfully')
    );
  } catch (error) {
    logError(error, 'Delete course controller');
    res.status(500).json(
      formatResponse(false, 'Failed to delete course')
    );
  }
};

// Get course categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      `SELECT 
        category,
        COUNT(*) as course_count,
        AVG(rating) as avg_rating
      FROM courses 
      GROUP BY category 
      ORDER BY course_count DESC`
    );

    res.json(
      formatResponse(true, 'Categories retrieved successfully', categories)
    );
  } catch (error) {
    logError(error, 'Get categories controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve categories')
    );
  }
};

// Enroll in course
const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id, title FROM courses WHERE id = ?',
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Course not found')
      );
    }

    // Check if already enrolled
    const [existingEnrollments] = await pool.execute(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, id]
    );

    if (existingEnrollments.length > 0) {
      return res.status(400).json(
        formatResponse(false, 'Already enrolled in this course')
      );
    }

    // Create enrollment
    const [result] = await pool.execute(
      'INSERT INTO enrollments (user_id, course_id, status, progress) VALUES (?, ?, ?, ?)',
      [userId, id, 'not_started', 0]
    );

    // Update course students count
    await pool.execute(
      'UPDATE courses SET students_count = students_count + 1 WHERE id = ?',
      [id]
    );

    logInfo('User enrolled in course', { userId, courseId: id });

    res.status(201).json(
      formatResponse(true, 'Successfully enrolled in course', {
        enrollmentId: result.insertId,
        courseTitle: courses[0].title
      })
    );
  } catch (error) {
    logError(error, 'Enroll in course controller');
    res.status(500).json(
      formatResponse(false, 'Failed to enroll in course')
    );
  }
};

// Get user's enrolled courses
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build WHERE clause
    let whereClause = 'WHERE e.user_id = ?';
    const values = [userId];

    if (status && status !== 'all') {
      whereClause += ' AND e.status = ?';
      values.push(status);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM enrollments e ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // Get enrolled courses
    const [enrollments] = await pool.execute(
      `SELECT 
        e.*,
        c.title,
        c.description,
        c.category,
        c.hours,
        c.topic_count,
        c.instructor,
        c.rating,
        c.image,
        c.level
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      ${whereClause}
      ORDER BY e.enrolled_at DESC
      LIMIT ? OFFSET ?`,
      [...values, queryLimit, offset]
    );

    const meta = getPaginationMeta(page, queryLimit, total);

    res.json(
      formatResponse(true, 'Enrolled courses retrieved successfully', enrollments, meta)
    );
  } catch (error) {
    logError(error, 'Get enrolled courses controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve enrolled courses')
    );
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  enrollInCourse,
  getEnrolledCourses
};