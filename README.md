# Student Skill Up Pathway - Full Stack Application

A comprehensive learning management system built with React.js frontend and Node.js backend, featuring course management, user authentication, payment processing, and media delivery.

## 🚀 Features

### Frontend (React.js)
- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Authentication**: JWT-based login/register system
- **Student Dashboard**: Course browsing, progress tracking, and profile management
- **Admin Dashboard**: Course management, student management, and analytics
- **Payment Integration**: Stripe-based payment system
- **Media Player**: Support for YouTube videos, PDFs, audio, and images

### Backend (Node.js + Express)
- **RESTful API**: Clean API architecture with proper error handling
- **MySQL Database**: Robust data storage with proper relationships
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Support for course media uploads
- **Payment Processing**: Stripe integration for course payments
- **Admin Features**: Complete CRUD operations for courses and users
- **Security**: Rate limiting, CORS, helmet, and input validation

## 📁 Project Structure

```
student-skill-up-pathway/
├── client/                 # React.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── lib/           # API client and utilities
│   │   ├── pages/         # Page components
│   │   └── data/          # Mock data and types
│   └── package.json
├── server/                 # Node.js Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   ├── uploads/          # File uploads directory
│   └── package.json
├── db/                    # Database schema
│   └── schema.sql
└── README.md
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd student-skill-up-pathway
```

### 2. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE student_skillup;
exit

# Import schema
mysql -u root -p student_skillup < db/schema.sql
```

### 3. Backend Setup
```bash
cd server
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database credentials and other settings

# Start development server
npm run dev
```

### 4. Frontend Setup
```bash
cd client
npm install

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Server (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_skillup

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🚀 Running the Application

### Development Mode
1. **Start Backend Server**:
   ```bash
   cd server
   npm run dev
   ```
   Server runs on: http://localhost:5000

2. **Start Frontend Server**:
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on: http://localhost:3000

### Production Build
1. **Build Frontend**:
   ```bash
   cd client
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   cd server
   npm start
   ```

## 📊 Database Schema

### Tables
- **users**: User accounts (students and admins)
- **courses**: Course information and metadata
- **media**: Course media files (videos, PDFs, etc.)
- **enrollments**: User course enrollments and progress
- **feedback**: Course reviews and ratings
- **payments**: Payment transactions and history

## 🔐 Authentication

### Default Accounts
- **Admin**: admin@skillup.com / admin123
- **Student**: Create new account via registration

### API Authentication
- JWT tokens stored in localStorage
- Automatic token refresh and validation
- Protected routes for authenticated users

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Payments
- `POST /api/payments/create` - Create payment
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Payment history

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/students` - All students
- `GET /api/admin/feedback` - All feedback

## 🎨 Frontend Features

### Student Features
- Browse and search courses
- Enroll in courses after payment
- Track learning progress
- Submit course feedback
- Manage profile settings

### Admin Features
- Manage courses (CRUD operations)
- Upload course media
- View student analytics
- Manage user accounts
- Process refunds

## 💳 Payment System

- **One-time Payment**: $10 for lifetime access
- **Stripe Integration**: Secure payment processing
- **Payment Status**: Track payment history
- **Access Control**: Paid users get full course access

## 🔒 Security Features

- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Sanitize all user inputs
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token implementation

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for production API URL

### Backend (Railway/Render)
1. Set up MySQL database
2. Configure environment variables
3. Deploy from GitHub repository
4. Run database migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@skillup.com

---

**Happy Learning! 🎓**