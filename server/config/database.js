const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_skillup',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeTables = async () => {
  try {
    // Users table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        paid BOOLEAN DEFAULT FALSE,
        avatar VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Courses table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        hours INT DEFAULT 0,
        topic_count INT DEFAULT 0,
        instructor VARCHAR(255) DEFAULT NULL,
        rating DECIMAL(2,1) DEFAULT 0.0,
        students_count INT DEFAULT 0,
        image VARCHAR(500) DEFAULT NULL,
        level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Media table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        type ENUM('pdf', 'video', 'audio', 'youtube', 'image') NOT NULL,
        url VARCHAR(1000) NOT NULL,
        description TEXT DEFAULT NULL,
        duration VARCHAR(50) DEFAULT NULL,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // Enrollments table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
        progress INT DEFAULT 0,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE KEY unique_enrollment (user_id, course_id)
      )
    `);

    // Feedback table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        comment TEXT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // Payments table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50) DEFAULT 'stripe',
        transaction_id VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing tables:', error.message);
    throw error;
  }
};

// Seed initial data
const seedData = async () => {
  try {
    // Check if admin user exists
    const [adminExists] = await promisePool.execute(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      ['admin@skillup.com', 'admin']
    );

    if (adminExists.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await promisePool.execute(
        'INSERT INTO users (name, email, password, role, paid) VALUES (?, ?, ?, ?, ?)',
        ['Admin User', 'admin@skillup.com', hashedPassword, 'admin', true]
      );
      
      console.log('✅ Admin user created: admin@skillup.com / admin123');
    }

    // Check if sample courses exist
    const [coursesExist] = await promisePool.execute('SELECT COUNT(*) as count FROM courses');
    
    if (coursesExist[0].count === 0) {
      // Insert sample courses
      const sampleCourses = [
        {
          title: 'Complete React.js Development',
          description: 'Master React.js from basics to advanced concepts including hooks, context, and modern patterns',
          category: 'Web Development',
          hours: 40,
          topic_count: 24,
          instructor: 'Sarah Johnson',
          rating: 4.8,
          students_count: 2341,
          image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
          level: 'Intermediate',
          featured: true
        },
        {
          title: 'Python Data Science Fundamentals',
          description: 'Learn data analysis, visualization, and machine learning with Python',
          category: 'Data Science',
          hours: 50,
          topic_count: 30,
          instructor: 'Dr. Michael Chen',
          rating: 4.9,
          students_count: 1876,
          image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
          level: 'Beginner',
          featured: true
        },
        {
          title: 'iOS App Development with Swift',
          description: 'Build professional iOS applications using Swift and Xcode',
          category: 'Mobile Development',
          hours: 60,
          topic_count: 36,
          instructor: 'Emma Rodriguez',
          rating: 4.7,
          students_count: 1234,
          image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
          level: 'Intermediate'
        }
      ];

      for (const course of sampleCourses) {
        await promisePool.execute(
          `INSERT INTO courses (title, description, category, hours, topic_count, instructor, rating, students_count, image, level, featured) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [course.title, course.description, course.category, course.hours, course.topic_count, 
           course.instructor, course.rating, course.students_count, course.image, course.level, course.featured || false]
        );
      }

      console.log('✅ Sample courses created');
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
};

module.exports = {
  pool: promisePool,
  testConnection,
  initializeTables,
  seedData
};