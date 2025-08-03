export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  topicCount: number;
  instructor: string;
  rating: number;
  students: number;
  image: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: Topic[];
  featured?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  duration: string;
  media: Media[];
}

export interface Media {
  id: string;
  type: 'video' | 'pdf' | 'audio' | 'youtube' | 'image';
  title: string;
  url: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Frontend and backend web technologies',
    icon: '🌐',
    color: 'from-blue-500 to-cyan-500',
    courseCount: 15
  },
  {
    id: '2',
    name: 'Data Science',
    description: 'Analytics, machine learning, and statistics',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
    courseCount: 12
  },
  {
    id: '3',
    name: 'Mobile Development',
    description: 'iOS and Android app development',
    icon: '📱',
    color: 'from-green-500 to-emerald-500',
    courseCount: 8
  },
  {
    id: '4',
    name: 'Cloud Computing',
    description: 'AWS, Azure, and cloud technologies',
    icon: '☁️',
    color: 'from-indigo-500 to-blue-500',
    courseCount: 10
  },
  {
    id: '5',
    name: 'Cybersecurity',
    description: 'Security protocols and ethical hacking',
    icon: '🔒',
    color: 'from-red-500 to-orange-500',
    courseCount: 7
  },
  {
    id: '6',
    name: 'AI & Machine Learning',
    description: 'Artificial intelligence and neural networks',
    icon: '🤖',
    color: 'from-yellow-500 to-orange-500',
    courseCount: 9
  },
  {
    id: '7',
    name: 'Database Management',
    description: 'SQL, NoSQL, and database design',
    icon: '🗄️',
    color: 'from-teal-500 to-cyan-500',
    courseCount: 6
  },
  {
    id: '8',
    name: 'DevOps',
    description: 'CI/CD, containerization, and automation',
    icon: '⚙️',
    color: 'from-gray-500 to-blue-500',
    courseCount: 11
  },
  {
    id: '9',
    name: 'UI/UX Design',
    description: 'User interface and experience design',
    icon: '🎨',
    color: 'from-pink-500 to-purple-500',
    courseCount: 8
  },
  {
    id: '10',
    name: 'Blockchain',
    description: 'Cryptocurrency and distributed systems',
    icon: '⛓️',
    color: 'from-orange-500 to-red-500',
    courseCount: 5
  }
];

export const courses: Course[] = [
  {
    id: '1',
    title: 'Complete React.js Development',
    description: 'Master React.js from basics to advanced concepts including hooks, context, and modern patterns',
    category: 'Web Development',
    duration: '8 weeks',
    topicCount: 24,
    instructor: 'Sarah Johnson',
    rating: 4.8,
    students: 2341,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 0,
    level: 'Intermediate',
    featured: true,
    topics: [
      {
        id: '1',
        title: 'Introduction to React',
        description: 'Getting started with React fundamentals',
        duration: '45 min',
        media: [
          {
            id: '1',
            type: 'youtube',
            title: 'React Basics Overview',
            url: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
            description: 'Introduction to React concepts'
          },
          {
            id: '2',
            type: 'pdf',
            title: 'React Setup Guide',
            url: '/docs/react-setup.pdf'
          }
        ]
      },
      {
        id: '2',
        title: 'Components and JSX',
        description: 'Understanding React components and JSX syntax',
        duration: '60 min',
        media: [
          {
            id: '3',
            type: 'youtube',
            title: 'JSX and Components',
            url: 'https://www.youtube.com/embed/DLX62G4lc44',
            description: 'Deep dive into JSX'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Python Data Science Fundamentals',
    description: 'Learn data analysis, visualization, and machine learning with Python',
    category: 'Data Science',
    duration: '10 weeks',
    topicCount: 30,
    instructor: 'Dr. Michael Chen',
    rating: 4.9,
    students: 1876,
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 0,
    level: 'Beginner',
    featured: true,
    topics: [
      {
        id: '3',
        title: 'Python Basics for Data Science',
        description: 'Essential Python concepts for data analysis',
        duration: '90 min',
        media: [
          {
            id: '4',
            type: 'youtube',
            title: 'Python Data Science Introduction',
            url: 'https://www.youtube.com/embed/LHBE6Q9XlzI',
            description: 'Getting started with Python for data science'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'iOS App Development with Swift',
    description: 'Build professional iOS applications using Swift and Xcode',
    category: 'Mobile Development',
    duration: '12 weeks',
    topicCount: 36,
    instructor: 'Emma Rodriguez',
    rating: 4.7,
    students: 1234,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 0,
    level: 'Intermediate',
    topics: [
      {
        id: '4',
        title: 'Swift Programming Basics',
        description: 'Introduction to Swift programming language',
        duration: '75 min',
        media: [
          {
            id: '5',
            type: 'youtube',
            title: 'Swift Programming Tutorial',
            url: 'https://www.youtube.com/embed/Ulp1Kimblg0',
            description: 'Learn Swift programming fundamentals'
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'AWS Cloud Practitioner',
    description: 'Complete guide to Amazon Web Services and cloud computing fundamentals',
    category: 'Cloud Computing',
    duration: '6 weeks',
    topicCount: 18,
    instructor: 'David Kim',
    rating: 4.6,
    students: 987,
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 0,
    level: 'Beginner',
    topics: [
      {
        id: '5',
        title: 'Introduction to Cloud Computing',
        description: 'Understanding cloud computing concepts',
        duration: '50 min',
        media: [
          {
            id: '6',
            type: 'youtube',
            title: 'Cloud Computing Explained',
            url: 'https://www.youtube.com/embed/dH0yz-Osy54',
            description: 'What is cloud computing?'
          }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Ethical Hacking & Cybersecurity',
    description: 'Learn penetration testing, network security, and ethical hacking techniques',
    category: 'Cybersecurity',
    duration: '14 weeks',
    topicCount: 42,
    instructor: 'Alex Thompson',
    rating: 4.8,
    students: 756,
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 0,
    level: 'Advanced',
    topics: [
      {
        id: '6',
        title: 'Cybersecurity Fundamentals',
        description: 'Basic concepts of cybersecurity',
        duration: '65 min',
        media: [
          {
            id: '7',
            type: 'youtube',
            title: 'Cybersecurity Basics',
            url: 'https://www.youtube.com/embed/inWWhr5tnEA',
            description: 'Introduction to cybersecurity'
          }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Machine Learning with TensorFlow',
    description: 'Build and deploy machine learning models using TensorFlow and Python',
    category: 'AI & Machine Learning',
    duration: '16 weeks',
    topicCount: 48,
    instructor: 'Dr. Lisa Wang',
    rating: 4.9,
    students: 1543,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 0,
    level: 'Advanced',
    featured: true,
    topics: [
      {
        id: '7',
        title: 'Introduction to Machine Learning',
        description: 'Understanding ML concepts and applications',
        duration: '80 min',
        media: [
          {
            id: '8',
            type: 'youtube',
            title: 'Machine Learning Explained',
            url: 'https://www.youtube.com/embed/aircAruvnKk',
            description: 'What is machine learning?'
          }
        ]
      }
    ]
  }
];

export const testimonials = [
  {
    id: '1',
    name: 'Jennifer Davis',
    role: 'Software Engineer at Google',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'SkillUp transformed my career! The React course was incredibly comprehensive and the hands-on projects helped me land my dream job.',
    rating: 5,
    course: 'Complete React.js Development'
  },
  {
    id: '2',
    name: 'Mark Johnson',
    role: 'Data Scientist at Microsoft',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The Python Data Science course exceeded my expectations. Dr. Chen explains complex concepts in such an easy way to understand.',
    rating: 5,
    course: 'Python Data Science Fundamentals'
  },
  {
    id: '3',
    name: 'Sarah Kim',
    role: 'Mobile Developer at Uber',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Amazing platform with high-quality content. The iOS development course helped me build my first app that got featured on the App Store!',
    rating: 5,
    course: 'iOS App Development with Swift'
  },
  {
    id: '4',
    name: 'Robert Chen',
    role: 'Cloud Architect at AWS',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The best $10 I ever spent! The AWS course was perfect for getting started with cloud computing. Now I work at AWS!',
    rating: 5,
    course: 'AWS Cloud Practitioner'
  }
];

export const stats = [
  {
    label: 'Active Students',
    value: '25,000+',
    icon: '👨‍🎓'
  },
  {
    label: 'Expert Instructors',
    value: '150+',
    icon: '👩‍🏫'
  },
  {
    label: 'Courses Available',
    value: '500+',
    icon: '📚'
  },
  {
    label: 'Success Rate',
    value: '94%',
    icon: '🎯'
  }
];