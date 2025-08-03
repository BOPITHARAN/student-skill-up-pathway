import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Edit, 
  Save, 
  Camera,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Settings,
  Bell,
  Shield,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate learner exploring new technologies and building amazing projects.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    github: 'https://github.com/username'
  });

  const achievements = [
    {
      id: 1,
      title: 'First Course Completed',
      description: 'Completed your first course on the platform',
      icon: '🎯',
      date: '2024-01-15',
      earned: true
    },
    {
      id: 2,
      title: 'JavaScript Master',
      description: 'Completed 5 JavaScript related courses',
      icon: '🚀',
      date: '2024-01-20',
      earned: true
    },
    {
      id: 3,
      title: 'Quick Learner',
      description: 'Completed a course in under 48 hours',
      icon: '⚡',
      date: '2024-01-18',
      earned: true
    },
    {
      id: 4,
      title: 'Marathon Learner',
      description: 'Study for 10 hours in a single week',
      icon: '🏃‍♂️',
      date: null,
      earned: false
    }
  ];

  const learningStats = {
    coursesCompleted: 8,
    totalHours: 127,
    currentStreak: 15,
    averageRating: 4.8,
    certificates: 6,
    skillsAcquired: 24
  };

  const recentActivity = [
    {
      id: 1,
      type: 'completed',
      course: 'Advanced React Patterns',
      date: '2024-01-20',
      icon: '✅'
    },
    {
      id: 2,
      type: 'started',
      course: 'Node.js Backend Development',
      date: '2024-01-19',
      icon: '📚'
    },
    {
      id: 3,
      type: 'certificate',
      course: 'Python Data Science',
      date: '2024-01-18',
      icon: '🏆'
    }
  ];

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                alt={user?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="text-2xl font-bold bg-transparent border-b-2 border-blue-600 text-gray-900 dark:text-white focus:outline-none"
                  />
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {profileData.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {profileData.bio}
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  {user?.role === 'admin' ? 'Administrator' : 'Student'}
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
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
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'stats', label: 'Learning Stats', icon: TrendingUp },
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'activity', label: 'Recent Activity', icon: Clock },
                { id: 'settings', label: 'Settings', icon: Settings }
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

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Stats Tab */}
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {learningStats.coursesCompleted}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {learningStats.totalHours}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
                    </div>
                    <Clock className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {learningStats.currentStreak}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {learningStats.averageRating}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {learningStats.certificates}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Certificates</p>
                    </div>
                    <Award className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {learningStats.skillsAcquired}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Skills Acquired</p>
                    </div>
                    <User className="w-8 h-8 text-red-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 ${
                      achievement.earned 
                        ? 'ring-2 ring-green-500' 
                        : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Earned on {achievement.date}
                          </p>
                        )}
                        {!achievement.earned && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Not earned yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.type === 'completed' && 'Completed'} 
                          {activity.type === 'started' && 'Started'} 
                          {activity.type === 'certificate' && 'Earned certificate for'} 
                          <span className="text-blue-600 dark:text-blue-400 ml-1">
                            {activity.course}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">Email Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">Course Updates</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Privacy
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">Public Profile</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">Show Progress</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Data Export
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Download your learning data and progress reports
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}