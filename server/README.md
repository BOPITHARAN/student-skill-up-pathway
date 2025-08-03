# Student Skill Up Pathway - Backend API

A comprehensive Node.js + Express backend with MySQL database for the Student Skill Up Pathway platform.

## 🚀 Features

- **Authentication System**: JWT-based auth with bcrypt password hashing
- **Course Management**: Full CRUD operations for courses and media
- **Student Dashboard**: Progress tracking and enrollment management
- **Admin Dashboard**: User management and analytics
- **Payment System**: Stripe integration for one-time payments
- **Feedback System**: Course reviews and ratings
- **File Upload**: Support for PDFs, videos, images, and audio
- **Security**: Rate limiting, CORS, helmet, and input validation

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with mysql2
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting

## 🛠 Installation

1. **Clone and navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=student_skillup
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up MySQL database**:
   ```sql
   CREATE DATABASE student_skillup;
   ```

5. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
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
```

### Courses Table
```sql
CREATE TABLE courses (
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
```

### Media Table
```sql
CREATE TABLE media (
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
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
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
```

### Feedback Table
```sql
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  comment TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
```

### Payments Table
```sql
CREATE TABLE payments (
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
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /verify` - Verify JWT token

### Course Routes (`/api/courses`)
- `GET /` - Get all courses (public)
- `GET /categories` - Get course categories
- `GET /enrolled` - Get user's enrolled courses
- `GET /:id` - Get single course
- `POST /` - Create course (admin)
- `PUT /:id` - Update course (admin)
- `DELETE /:id` - Delete course (admin)
- `POST /:id/enroll` - Enroll in course

### Media Routes (`/api/media`)
- `GET /course/:courseId` - Get course media
- `POST /course/:courseId` - Add media to course (admin)
- `POST /course/:courseId/upload` - Upload file (admin)
- `PUT /:id` - Update media (admin)
- `DELETE /:id` - Delete media (admin)
- `PUT /course/:courseId/reorder` - Reorder media (admin)

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Get dashboard stats
- `GET /students` - Get all students
- `GET /students/:id` - Get student details
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student
- `GET /feedback` - Get all feedback
- `GET /activity` - Get recent activity

### Payment Routes (`/api/payments`)
- `POST /create` - Create payment intent
- `POST /confirm` - Confirm payment
- `GET /history` - Get payment history
- `GET /` - Get all payments (admin)
- `GET /stats` - Get payment statistics (admin)
- `POST /:id/refund` - Refund payment (admin)

### Feedback Routes (`/api/feedback`)
- `POST /` - Submit feedback
- `GET /course/:courseId` - Get course feedback
- `GET /user` - Get user's feedback
- `PUT /:id` - Update feedback
- `DELETE /:id` - Delete feedback

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🛡 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Auth Rate Limiting**: 5 login/register attempts per 15 minutes per IP
- **CORS**: Configured for frontend domains
- **Helmet**: Security headers
- **Input Validation**: All inputs validated and sanitized
- **Password Hashing**: bcrypt with salt rounds of 12
- **SQL Injection Protection**: Parameterized queries

## 📁 Project Structure

```
server/
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── courseController.js
│   ├── mediaController.js
│   ├── adminController.js
│   ├── paymentController.js
│   └── feedbackController.js
├── routes/              # API routes
│   ├── auth.js
│   ├── courses.js
│   ├── media.js
│   ├── admin.js
│   ├── payments.js
│   └── feedback.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   └── upload.js
├── config/             # Configuration files
│   └── database.js
├── utils/              # Utility functions
│   └── helpers.js
├── uploads/            # File uploads directory
├── .env               # Environment variables
├── .env.example       # Environment template
├── package.json       # Dependencies
└── index.js          # Main server file
```

## 🧪 Default Admin Account

The system creates a default admin account on first run:
- **Email**: admin@skillup.com
- **Password**: admin123

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | student_skillup |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max upload size | 10485760 (10MB) |
| `UPLOAD_PATH` | Upload directory | ./uploads |

## 🚀 Deployment

1. **Set environment to production**:
   ```env
   NODE_ENV=production
   ```

2. **Use a process manager**:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "skillup-api"
   ```

3. **Set up reverse proxy** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Logs are output to console (use PM2 or similar for log management)
- Error tracking and performance monitoring recommended for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.