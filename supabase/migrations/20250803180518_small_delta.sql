-- Student Skill Up Pathway Database Schema
-- MySQL Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS student_skillup;
USE student_skillup;

-- Users table
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
);

-- Courses table
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
);

-- Media table
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
);

-- Enrollments table
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
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  comment TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Payments table
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
);

-- Insert default admin user
INSERT IGNORE INTO users (name, email, password, role, paid) VALUES 
('Admin User', 'admin@skillup.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'admin', TRUE);

-- Insert sample courses
INSERT IGNORE INTO courses (title, description, category, hours, topic_count, instructor, rating, students_count, image, level, featured) VALUES
('Complete React.js Development', 'Master React.js from basics to advanced concepts including hooks, context, and modern patterns', 'Web Development', 40, 24, 'Sarah Johnson', 4.8, 2341, 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop', 'Intermediate', TRUE),
('Python Data Science Fundamentals', 'Learn data analysis, visualization, and machine learning with Python', 'Data Science', 50, 30, 'Dr. Michael Chen', 4.9, 1876, 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop', 'Beginner', TRUE),
('iOS App Development with Swift', 'Build professional iOS applications using Swift and Xcode', 'Mobile Development', 60, 36, 'Emma Rodriguez', 4.7, 1234, 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop', 'Intermediate', FALSE);

-- Insert sample media for courses
INSERT IGNORE INTO media (course_id, title, type, url, description, duration, order_index) VALUES
(1, 'Introduction to React', 'youtube', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 'Getting started with React fundamentals', '45 min', 1),
(1, 'React Setup Guide', 'pdf', '/docs/react-setup.pdf', 'Complete setup guide for React development', NULL, 2),
(2, 'Python Data Science Introduction', 'youtube', 'https://www.youtube.com/embed/LHBE6Q9XlzI', 'Introduction to Python for data science', '60 min', 1),
(3, 'Swift Programming Tutorial', 'youtube', 'https://www.youtube.com/embed/Ulp1Kimblg0', 'Learn Swift programming fundamentals', '75 min', 1);