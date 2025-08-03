import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { courses } from '../data/mockData';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCourse, setShowAddCourse] = useState(false);

  // Mock data for admin dashboard
  const adminStats = {
    totalStudents: 2547,
    totalCourses: 78,
    totalRevenue: 25470,
    paidStudents: 2341,
    unpaidStudents: 206,
    averageRating: 4.7
  };

  const recentStudents = [
    { id: 1, name: 'John Doe', email: 'john@example.com', paid: true, joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', paid: false, joinDate: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', paid: true, joinDate: '2024-01-13' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', paid: true, joinDate: '2024-01-12' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', paid: false, joinDate: '2024-01-11' }
  ];

  const AddCourseModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Course</h3>
          <button
            onClick={() => setShowAddCourse(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Web Development</option>
                <option>Data Science</option>
                <option>Mobile Development</option>
                <option>Cloud Computing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter course description"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g., 8 weeks"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic Count
              </label>
              <input
                type="number"
                placeholder="24"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Level
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Image
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Drop your image here or <span className="text-blue-600 cursor-pointer">browse</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowAddCourse(false)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Create Course
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-white/90">
                  Manage your platform, students, and courses
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${adminStats.totalRevenue.toLocaleString()}</div>
                <div className="text-white/80">Total Revenue</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-2">
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'payments', label: 'Payments', icon: DollarSign }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {adminStats.totalStudents.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {adminStats.totalCourses}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {adminStats.paidStudents.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Paid Students</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {adminStats.averageRating}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Recent Students */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Students</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Join Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{student.name}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{student.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            student.paid 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {student.paid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{student.joinDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h2>
              <button
                onClick={() => setShowAddCourse(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Course
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {course.students} students
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {showAddCourse && <AddCourseModal />}
    </div>
  );
}