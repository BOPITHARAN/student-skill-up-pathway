const { pool } = require('../config/database');
const { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  formatResponse, 
  sanitizeUser,
  logError,
  logInfo
} = require('../utils/helpers');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json(
        formatResponse(false, 'User with this email already exists')
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, paid) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'student', false]
    );

    // Get created user
    const [users] = await pool.execute(
      'SELECT id, name, email, role, paid, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];
    const token = generateToken(user.id);

    logInfo('User registered successfully', { userId: user.id, email });

    res.status(201).json(
      formatResponse(true, 'User registered successfully', {
        user: sanitizeUser(user),
        token
      })
    );
  } catch (error) {
    logError(error, 'Register controller');
    res.status(500).json(
      formatResponse(false, 'Registration failed. Please try again.')
    );
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [users] = await pool.execute(
      'SELECT id, name, email, password, role, paid, created_at FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json(
        formatResponse(false, 'Invalid email or password')
      );
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(
        formatResponse(false, 'Invalid email or password')
      );
    }

    // Generate token
    const token = generateToken(user.id);

    logInfo('User logged in successfully', { userId: user.id, email });

    res.json(
      formatResponse(true, 'Login successful', {
        user: sanitizeUser(user),
        token
      })
    );
  } catch (error) {
    logError(error, 'Login controller');
    res.status(500).json(
      formatResponse(false, 'Login failed. Please try again.')
    );
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(
      'SELECT id, name, email, role, paid, avatar, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'User not found')
      );
    }

    res.json(
      formatResponse(true, 'Profile retrieved successfully', {
        user: users[0]
      })
    );
  } catch (error) {
    logError(error, 'Get profile controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve profile')
    );
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (avatar) {
      updates.push('avatar = ?');
      values.push(avatar);
    }

    if (updates.length === 0) {
      return res.status(400).json(
        formatResponse(false, 'No valid fields to update')
      );
    }

    values.push(userId);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    // Get updated user
    const [users] = await pool.execute(
      'SELECT id, name, email, role, paid, avatar, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    logInfo('Profile updated successfully', { userId });

    res.json(
      formatResponse(true, 'Profile updated successfully', {
        user: users[0]
      })
    );
  } catch (error) {
    logError(error, 'Update profile controller');
    res.status(500).json(
      formatResponse(false, 'Failed to update profile')
    );
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'User not found')
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, users[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json(
        formatResponse(false, 'Current password is incorrect')
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await pool.execute(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, userId]
    );

    logInfo('Password changed successfully', { userId });

    res.json(
      formatResponse(true, 'Password changed successfully')
    );
  } catch (error) {
    logError(error, 'Change password controller');
    res.status(500).json(
      formatResponse(false, 'Failed to change password')
    );
  }
};

// Verify token (for frontend to check if token is still valid)
const verifyToken = async (req, res) => {
  try {
    // If we reach here, token is valid (middleware already verified it)
    res.json(
      formatResponse(true, 'Token is valid', {
        user: sanitizeUser(req.user)
      })
    );
  } catch (error) {
    logError(error, 'Verify token controller');
    res.status(500).json(
      formatResponse(false, 'Token verification failed')
    );
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
};