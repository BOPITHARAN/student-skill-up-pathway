const { pool } = require('../config/database');
const { 
  formatResponse, 
  isValidUrl,
  extractYouTubeId,
  generateYouTubeEmbedUrl,
  logError,
  logInfo
} = require('../utils/helpers');

// Get media for a course
const getCourseMedia = async (req, res) => {
  try {
    const { courseId } = req.params;

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

    // Get media
    const [media] = await pool.execute(
      'SELECT * FROM media WHERE course_id = ? ORDER BY order_index ASC, created_at ASC',
      [courseId]
    );

    res.json(
      formatResponse(true, 'Media retrieved successfully', media)
    );
  } catch (error) {
    logError(error, 'Get course media controller');
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve media')
    );
  }
};

// Add media to course (Admin only)
const addMedia = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, type, url, description, duration, order_index = 0 } = req.body;

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

    // Validate URL
    if (!isValidUrl(url)) {
      return res.status(400).json(
        formatResponse(false, 'Invalid URL provided')
      );
    }

    // Process YouTube URLs
    let processedUrl = url;
    if (type === 'youtube') {
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return res.status(400).json(
          formatResponse(false, 'Invalid YouTube URL')
        );
      }
      processedUrl = generateYouTubeEmbedUrl(videoId);
    }

    // Add media
    const [result] = await pool.execute(
      'INSERT INTO media (course_id, title, type, url, description, duration, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [courseId, title, type, processedUrl, description, duration, order_index]
    );

    // Get created media
    const [media] = await pool.execute(
      'SELECT * FROM media WHERE id = ?',
      [result.insertId]
    );

    // Update course topic count
    await pool.execute(
      'UPDATE courses SET topic_count = (SELECT COUNT(*) FROM media WHERE course_id = ?) WHERE id = ?',
      [courseId, courseId]
    );

    logInfo('Media added to course', { mediaId: result.insertId, courseId, type });

    res.status(201).json(
      formatResponse(true, 'Media added successfully', media[0])
    );
  } catch (error) {
    logError(error, 'Add media controller');
    res.status(500).json(
      formatResponse(false, 'Failed to add media')
    );
  }
};

// Update media (Admin only)
const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if media exists
    const [existingMedia] = await pool.execute(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

    if (existingMedia.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Media not found')
      );
    }

    // Build update query
    const allowedFields = ['title', 'type', 'url', 'description', 'duration', 'order_index'];
    const updateFields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        let value = updates[key];
        
        // Process URL if being updated
        if (key === 'url') {
          if (!isValidUrl(value)) {
            return res.status(400).json(
              formatResponse(false, 'Invalid URL provided')
            );
          }
          
          // Process YouTube URLs
          if (updates.type === 'youtube' || existingMedia[0].type === 'youtube') {
            const videoId = extractYouTubeId(value);
            if (!videoId) {
              return res.status(400).json(
                formatResponse(false, 'Invalid YouTube URL')
              );
            }
            value = generateYouTubeEmbedUrl(videoId);
          }
        }
        
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json(
        formatResponse(false, 'No valid fields to update')
      );
    }

    values.push(id);

    await pool.execute(
      `UPDATE media SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated media
    const [media] = await pool.execute(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

    logInfo('Media updated successfully', { mediaId: id });

    res.json(
      formatResponse(true, 'Media updated successfully', media[0])
    );
  } catch (error) {
    logError(error, 'Update media controller');
    res.status(500).json(
      formatResponse(false, 'Failed to update media')
    );
  }
};

// Delete media (Admin only)
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if media exists
    const [existingMedia] = await pool.execute(
      'SELECT course_id, title FROM media WHERE id = ?',
      [id]
    );

    if (existingMedia.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Media not found')
      );
    }

    const courseId = existingMedia[0].course_id;

    // Delete media
    await pool.execute('DELETE FROM media WHERE id = ?', [id]);

    // Update course topic count
    await pool.execute(
      'UPDATE courses SET topic_count = (SELECT COUNT(*) FROM media WHERE course_id = ?) WHERE id = ?',
      [courseId, courseId]
    );

    logInfo('Media deleted successfully', { mediaId: id, courseId });

    res.json(
      formatResponse(true, 'Media deleted successfully')
    );
  } catch (error) {
    logError(error, 'Delete media controller');
    res.status(500).json(
      formatResponse(false, 'Failed to delete media')
    );
  }
};

// Reorder media (Admin only)
const reorderMedia = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { mediaOrder } = req.body; // Array of { id, order_index }

    if (!Array.isArray(mediaOrder)) {
      return res.status(400).json(
        formatResponse(false, 'Media order must be an array')
      );
    }

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

    // Update order for each media item
    for (const item of mediaOrder) {
      if (item.id && typeof item.order_index === 'number') {
        await pool.execute(
          'UPDATE media SET order_index = ? WHERE id = ? AND course_id = ?',
          [item.order_index, item.id, courseId]
        );
      }
    }

    // Get updated media list
    const [media] = await pool.execute(
      'SELECT * FROM media WHERE course_id = ? ORDER BY order_index ASC, created_at ASC',
      [courseId]
    );

    logInfo('Media reordered successfully', { courseId });

    res.json(
      formatResponse(true, 'Media reordered successfully', media)
    );
  } catch (error) {
    logError(error, 'Reorder media controller');
    res.status(500).json(
      formatResponse(false, 'Failed to reorder media')
    );
  }
};

// Upload file and create media entry
const uploadMedia = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, duration, order_index = 0 } = req.body;

    if (!req.file) {
      return res.status(400).json(
        formatResponse(false, 'No file uploaded')
      );
    }

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

    // Determine media type based on file mimetype
    let mediaType = 'file';
    if (req.file.mimetype.startsWith('image/')) {
      mediaType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      mediaType = 'video';
    } else if (req.file.mimetype.startsWith('audio/')) {
      mediaType = 'audio';
    } else if (req.file.mimetype === 'application/pdf') {
      mediaType = 'pdf';
    }

    // Generate file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Add media entry
    const [result] = await pool.execute(
      'INSERT INTO media (course_id, title, type, url, description, duration, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [courseId, title || req.file.originalname, mediaType, fileUrl, description, duration, order_index]
    );

    // Get created media
    const [media] = await pool.execute(
      'SELECT * FROM media WHERE id = ?',
      [result.insertId]
    );

    // Update course topic count
    await pool.execute(
      'UPDATE courses SET topic_count = (SELECT COUNT(*) FROM media WHERE course_id = ?) WHERE id = ?',
      [courseId, courseId]
    );

    logInfo('File uploaded and media created', { mediaId: result.insertId, courseId, filename: req.file.filename });

    res.status(201).json(
      formatResponse(true, 'File uploaded successfully', media[0])
    );
  } catch (error) {
    logError(error, 'Upload media controller');
    res.status(500).json(
      formatResponse(false, 'Failed to upload file')
    );
  }
};

module.exports = {
  getCourseMedia,
  addMedia,
  updateMedia,
  deleteMedia,
  reorderMedia,
  uploadMedia
};