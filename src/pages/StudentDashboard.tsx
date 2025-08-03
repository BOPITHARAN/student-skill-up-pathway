import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award, 
  Play,
  Users,
  Star,
  Filter,
  Search,
  ChevronRight,
  BarChart3,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { courses, categories } from '../data/mockData';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter courses based on category and search
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Mock user progress data
  const userStats = {
    coursesCompleted: 3,
    coursesInProgress: 2,
    totalHoursLearned: 47,
    skillsAcquired: 12,
    completionRate: 75
  };

  const recentCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-white/90 mb-4">
                  Continue your learning journey and explore new skills
                </p>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">{userStats.coursesCompleted}</div>
                    <div className="text-sm text-white/80">Completed</div>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">{userStats.totalHoursLearned}</div>
                    <div className="text-sm text-white/80">Hours</div>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">{userStats.completionRate}%</div>
                    <div className="text-sm text-white/80">Progress</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-16 h-16 text-white" />
                </div>
                <p className="text-white/90">Keep up the great work!</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.coursesInProgress}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.skillsAcquired}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Skills</p>
                  </div>
                  <Target className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.totalHoursLearned}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hours</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.coursesCompleted}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      FREE
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        {course.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.topicCount} topics
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {course.students.toLocaleString()} students
                        </span>
                      </div>
                      <Link
                        to={`/course/${course.id}`}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Learning Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userStats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${userStats.completionRate}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-600">{userStats.coursesCompleted}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{userStats.coursesInProgress}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Continue Learning */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Continue Learning
              </h3>
              <div className="space-y-4">
                {recentCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {course.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {course.category}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Categories Quick Access */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 8).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-lg mb-1">{category.icon}</div>
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {category.courseCount} courses
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}