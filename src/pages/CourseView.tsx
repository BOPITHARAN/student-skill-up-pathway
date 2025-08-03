import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  Volume2, 
  Download,
  CheckCircle,
  Clock,
  Star,
  Users,
  BookOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { courses } from '../data/mockData';

export default function CourseView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [expandedTopics, setExpandedTopics] = useState<number[]>([0]);

  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Course Not Found
            </h1>
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toggleTopic = (index: number) => {
    setExpandedTopics(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'youtube':
        return <Play className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'audio':
        return <Volume2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const renderMediaContent = (media: any) => {
    switch (media.type) {
      case 'youtube':
        return (
          <div className="aspect-video">
            <iframe
              src={media.url}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      case 'video':
        return (
          <div className="aspect-video">
            <video
              controls
              className="w-full h-full rounded-lg"
              src={media.url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
            <audio controls className="w-full">
              <source src={media.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'pdf':
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {media.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {media.description || 'PDF Document'}
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
              <Download className="w-4 h-4" />
              Open PDF
            </button>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Media content not available
            </p>
          </div>
        );
    }
  };

  const currentTopic = course.topics[selectedTopic];
  const currentMedia = currentTopic?.media[selectedMedia];

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
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                    {course.category}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {course.level}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {course.title}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {course.description}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.topicCount} topics
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>
              </div>
              
              <div>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
            >
              {currentMedia ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentMedia.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      {getMediaIcon(currentMedia.type)}
                      <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {currentMedia.type}
                      </span>
                    </div>
                  </div>
                  
                  {renderMediaContent(currentMedia)}
                  
                  {currentMedia.description && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">
                        {currentMedia.description}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to {course.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Select a topic from the sidebar to start learning
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Course Navigation */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Course Content
              </h3>
              
              <div className="space-y-2">
                {course.topics.map((topic, topicIndex) => (
                  <div key={topic.id}>
                    <button
                      onClick={() => toggleTopic(topicIndex)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedTopic === topicIndex
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-left">
                          {topic.title}
                        </span>
                      </div>
                      {expandedTopics.includes(topicIndex) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedTopics.includes(topicIndex) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="ml-4 mt-2 space-y-1"
                      >
                        {topic.media.map((media, mediaIndex) => (
                          <button
                            key={media.id}
                            onClick={() => {
                              setSelectedTopic(topicIndex);
                              setSelectedMedia(mediaIndex);
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded text-left transition-colors ${
                              selectedTopic === topicIndex && selectedMedia === mediaIndex
                                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {getMediaIcon(media.type)}
                            <span className="text-sm">{media.title}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Course Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Your Progress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Course Progress</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-1/4" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">2</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">6</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Remaining</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Instructor Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Instructor
              </h3>
              
              <div className="flex items-center gap-3">
                <img
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {course.instructor}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Senior Developer
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}