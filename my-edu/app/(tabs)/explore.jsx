import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Animated, Image, TextInput, Dimensions, Alert, Modal, ActivityIndicator, BackHandler } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation, useRouter } from 'expo-router';
import ProgressTracker from '../../utils/progressTracker';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function Explore() {
  const navigation = useNavigation();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedFilter, setSelectedFilter] = useState('All');
  const scrollViewRef = useRef(null);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [webViewTitle, setWebViewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExternalContent, setIsExternalContent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedPath, setExpandedPath] = useState(null);

  // References to section positions
  const sectionRefs = {
    Popular: useRef(null),
    Newest: useRef(null),
    Trending: useRef(null),
    'Top Rated': useRef(null),
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 100], // Reduced from 250 to 200 since we removed search bar
    extrapolate: 'clamp',
  });

  const filters = ['All', 'Popular', 'Newest', 'Trending', 'Top Rated'];

  const scrollToSection = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'All') {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    
    const sectionRef = sectionRefs[filter]?.current;
    if (sectionRef) {
      sectionRef.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: pageY - 100, // Adjust for header height
          animated: true,
        });
      });
    }
  };

  const categories = [
    {
      id: 1,
      title: 'Programming',
      icon: <FontAwesome5 name="laptop-code" size={28} color={Colors.PRIMARY} />,
      courses: 150,
      backgroundColor: '#FFE5E5'
    },
    {
      id: 2,
      title: 'Design',
      icon: <MaterialIcons name="design-services" size={28} color={Colors.PRIMARY} />,
      courses: 120,
      backgroundColor: '#E5F6FF'
    },
    {
      id: 3,
      title: 'Mathematics',
      icon: <FontAwesome5 name="square-root-alt" size={28} color={Colors.PRIMARY} />,
      courses: 90,
      backgroundColor: '#E5FFE9'
    },
    {
      id: 4,
      title: 'Languages',
      icon: <MaterialIcons name="translate" size={28} color={Colors.PRIMARY} />,
      courses: 85,
      backgroundColor: '#F5E6FF'
    },
    {
      id: 5,
      title: 'Science',
      icon: <MaterialIcons name="science" size={28} color={Colors.PRIMARY} />,
      courses: 95,
      backgroundColor: '#FFE5F6'
    },
    {
      id: 6,
      title: 'Music',
      icon: <MaterialIcons name="music-note" size={28} color={Colors.PRIMARY} />,
      courses: 70,
      backgroundColor: '#E5FFF1'
    }
  ];

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, [isExternalContent]);

  const handleBackPress = () => {
    if (isExternalContent) {
      setIsExternalContent(false);
      return true;
    }
    return false;
  };

  // Enhanced handleOpenLink function
  const handleOpenLink = async (url, title) => {
    try {
      setIsLoading(true);
      
      // Track learning time and course progress
      await ProgressTracker.updateLearningTime(5); // Add 5 minutes for each content view
      
      // Open URL in browser
      const result = await WebBrowser.openBrowserAsync(url);
      
      if (result.type === 'completed') {
        // Track course progress if it's a course URL
        if (url.includes('course')) {
          await ProgressTracker.trackCourseProgress(
            url, // Using URL as courseId
            title,
            Math.floor(Math.random() * 20) + 5, // Simulate 5-25% progress for each view
            getCategoryFromUrl(url) // Helper function to determine category
          );
        }
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert(
        'Error',
        'Unable to open the link. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine category from URL
  const getCategoryFromUrl = (url) => {
    if (url.includes('programming') || url.includes('code')) return 'Programming';
    if (url.includes('design')) return 'Design';
    if (url.includes('math')) return 'Mathematics';
    if (url.includes('language')) return 'Languages';
    if (url.includes('science')) return 'Science';
    if (url.includes('music')) return 'Music';
    return 'Other';
  };

  // Update category URLs
  const categoryUrls = {
    'Programming': 'https://www.freecodecamp.org/learn',
    'Design': 'https://www.coursera.org/browse/arts-and-humanities/design',
    'Mathematics': 'https://www.khanacademy.org/math',
    'Languages': 'https://www.duolingo.com',
    'Science': 'https://www.edx.org/learn/science',
    'Music': 'https://www.coursera.org/browse/arts-and-humanities/music'
  };

  // Update course URLs
  const courseUrls = {
    'Complete Python Bootcamp 2024': 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
    'Machine Learning A-Z': 'https://www.coursera.org/learn/machine-learning',
    'Modern Web Development': 'https://www.freecodecamp.org/learn/responsive-web-design/'
  };

  // Update learning path URLs
  const pathUrls = {
    'Full-Stack Development': 'https://www.freecodecamp.org/learn/full-stack/',
    'Data Science': 'https://www.coursera.org/professional-certificates/ibm-data-science'
  };

  // Update workshop URLs
  const workshopUrls = {
    'Building AI Applications': 'https://www.coursera.org/learn/ai-for-everyone',
    'Mastering React Native': 'https://www.freecodecamp.org/learn/mobile-app-development/'
  };

  // Update certification URLs
  const certificationUrls = {
    'Full Stack Developer': 'https://www.freecodecamp.org/learn/full-stack/',
    'Data Science Specialist': 'https://www.coursera.org/professional-certificates/ibm-data-science'
  };

  // Enhanced category content structure
  const categoryContent = {
    'Programming': {
      description: 'Master various programming languages and software development skills',
      popularTopics: ['Python', 'JavaScript', 'Java', 'Web Development', 'Mobile Apps'],
      learningPaths: [
        {
          title: 'Web Development',
          duration: '6 months',
          courses: ['HTML & CSS Basics', 'JavaScript Fundamentals', 'React Development']
        },
        {
          title: 'Mobile Development',
          duration: '4 months',
          courses: ['React Native Basics', 'iOS Development', 'Android Development']
        }
      ],
      resources: [
        {
          title: 'FreeCodeCamp',
          url: 'https://www.freecodecamp.org/learn'
        },
        {
          title: 'MDN Web Docs',
          url: 'https://developer.mozilla.org/'
        }
      ]
    },
    'Design': {
      description: 'Learn UI/UX design, graphic design, and digital art',
      popularTopics: ['UI Design', 'UX Research', 'Graphic Design', 'Design Systems', 'Typography'],
      learningPaths: [
        {
          title: 'UI/UX Design',
          duration: '5 months',
          courses: ['Design Principles', 'User Research', 'Prototyping']
        },
        {
          title: 'Graphic Design',
          duration: '4 months',
          courses: ['Color Theory', 'Typography', 'Brand Design']
        }
      ],
      resources: [
        {
          title: 'Figma Tutorials',
          url: 'https://www.figma.com/resources/learn-design/'
        },
        {
          title: 'Design Resources',
          url: 'https://www.coursera.org/browse/arts-and-humanities/design'
        }
      ]
    },
    'Mathematics': {
      description: 'Explore mathematics from basic concepts to advanced topics',
      popularTopics: ['Calculus', 'Linear Algebra', 'Statistics', 'Discrete Math', 'Number Theory'],
      learningPaths: [
        {
          title: 'Data Science Math',
          duration: '3 months',
          courses: ['Statistics', 'Linear Algebra', 'Calculus']
        },
        {
          title: 'Pure Mathematics',
          duration: '6 months',
          courses: ['Abstract Algebra', 'Real Analysis', 'Number Theory']
        }
      ],
      resources: [
        {
          title: 'Khan Academy',
          url: 'https://www.khanacademy.org/math'
        },
        {
          title: 'MIT OpenCourseWare',
          url: 'https://ocw.mit.edu/courses/mathematics/'
        }
      ]
    },
    'Languages': {
      description: 'Learn new languages and improve your communication skills',
      popularTopics: ['English', 'Spanish', 'Mandarin', 'French', 'German'],
      learningPaths: [
        {
          title: 'Business English',
          duration: '4 months',
          courses: ['Business Communication', 'Professional Writing', 'Presentation Skills']
        },
        {
          title: 'Spanish Fluency',
          duration: '6 months',
          courses: ['Spanish Basics', 'Intermediate Spanish', 'Advanced Conversation']
        }
      ],
      resources: [
        {
          title: 'Duolingo',
          url: 'https://www.duolingo.com'
        },
        {
          title: 'Language Exchange',
          url: 'https://www.conversationexchange.com'
        }
      ]
    },
    'Science': {
      description: 'Discover the wonders of science across various disciplines',
      popularTopics: ['Physics', 'Chemistry', 'Biology', 'Astronomy', 'Environmental Science'],
      learningPaths: [
        {
          title: 'Physics Fundamentals',
          duration: '5 months',
          courses: ['Classical Mechanics', 'Electromagnetism', 'Quantum Physics']
        },
        {
          title: 'Life Sciences',
          duration: '6 months',
          courses: ['Cell Biology', 'Genetics', 'Evolution']
        }
      ],
      resources: [
        {
          title: 'edX Science Courses',
          url: 'https://www.edx.org/learn/science'
        },
        {
          title: 'National Geographic',
          url: 'https://education.nationalgeographic.org'
        }
      ]
    },
    'Music': {
      description: 'Learn music theory, instruments, and production',
      popularTopics: ['Music Theory', 'Piano', 'Guitar', 'Music Production', 'Songwriting'],
      learningPaths: [
        {
          title: 'Music Production',
          duration: '4 months',
          courses: ['DAW Basics', 'Sound Design', 'Mixing & Mastering']
        },
        {
          title: 'Music Theory',
          duration: '3 months',
          courses: ['Basic Theory', 'Harmony', 'Composition']
        }
      ],
      resources: [
        {
          title: 'Coursera Music',
          url: 'https://www.coursera.org/browse/arts-and-humanities/music'
        },
        {
          title: 'Berklee Online',
          url: 'https://online.berklee.edu'
        }
      ]
    }
  };

  // Enhanced handleCategoryPress function
  const handleCategoryPress = async (category) => {
    try {
      setSelectedCategory(category.title);
      const categoryData = categoryContent[category.title];
      
      // Track category exploration
      await ProgressTracker.addRecentActivity({
        type: 'category_explored',
        title: `Explored ${category.title}`,
        detail: 'Browsing category content',
        timestamp: new Date().toISOString()
      });

      // Show category detail modal
      Alert.alert(
        category.title,
        categoryData.description,
        [
          {
            text: 'View Resources',
            onPress: () => {
              categoryData.resources.forEach(resource => {
                handleOpenLink(resource.url, resource.title);
              });
            }
          },
          {
            text: 'Start Learning Path',
            onPress: () => {
              const path = categoryData.learningPaths[0];
              handleLearningPathPress({
                title: path.title,
                duration: path.duration,
                courses: path.courses.length,
                category: category.title
              });
            }
          },
          {
            text: 'Close',
            style: 'cancel'
          }
        ]
      );

      // Update category progress
      const progress = await ProgressTracker.getCategoryProgress();
      const categoryIndex = progress.findIndex(cat => cat.name === category.title);
      if (categoryIndex !== -1) {
        progress[categoryIndex].explored = true;
        await ProgressTracker.updateCategoryProgress(progress);
      }
    } catch (error) {
      console.error('Error handling category:', error);
    }
  };

  // Update handleCoursePress
  const handleCoursePress = async (course) => {
    try {
      const url = courseUrls[course.title] || course.courseUrl;
      if (url) {
        // Track course start if not already started
        const courseProgress = await ProgressTracker.getCourseProgress();
        if (!courseProgress[url]) {
          const stats = await ProgressTracker.getLearningStats();
          stats.coursesStarted += 1;
          await ProgressTracker.saveLearningStats(stats);
        }

        await handleOpenLink(url, course.title);
      }
    } catch (error) {
      console.error('Error handling course:', error);
    }
  };

  // Update handleLearningPathPress
  const handleLearningPathPress = async (path) => {
    try {
      const url = pathUrls[path.title];
      if (url) {
        await handleOpenLink(url, path.title);
      }
    } catch (error) {
      console.error('Error handling learning path:', error);
    }
  };

  // Update handleWorkshopPress
  const handleWorkshopPress = async (workshop) => {
    try {
      const url = workshopUrls[workshop.title];
      if (url) {
        await ProgressTracker.updateWorkshopStatus(
          workshop.id,
          workshop.title,
          { registered: true }
        );
        await handleOpenLink(url, workshop.title);
      }
    } catch (error) {
      console.error('Error handling workshop:', error);
    }
  };

  // Update handleCertificationPress
  const handleCertificationPress = async (cert) => {
    try {
      const url = certificationUrls[cert.title];
      if (url) {
        await ProgressTracker.updateCertificationProgress(
          cert.id,
          cert.title,
          0,
          cert.tasks ? cert.tasks.length : 10
        );
        await handleOpenLink(url, cert.title);
      }
    } catch (error) {
      console.error('Error handling certification:', error);
    }
  };

  // Function to handle success stories
  const handleStoryPress = (story) => {
    const storyUrls = {
      'Michael Chen': 'https://www.linkedin.com/in/example-success-story-1',
      'Emma Watson': 'https://www.linkedin.com/in/example-success-story-2'
    };
    handleOpenLink(storyUrls[story.name], `${story.name}'s Success Story`);
  };

  // Function to handle event registration
  const handleEventPress = (event) => {
    const eventUrls = {
      'Tech Career Fair 2024': 'https://example.com/tech-career-fair-2024',
      'Global Coding Challenge': 'https://example.com/coding-challenge-2024'
    };
    handleOpenLink(eventUrls[event.title], event.title);
  };

  const handleInstructorPress = (instructor) => {
    const instructorUrls = {
      'Dr. Angela Yu': 'https://www.udemy.com/user/4b4368a3-b5c8-4529-aa65-2056ec31f37e/',
      'Prof. Andrew Ng': 'https://www.coursera.org/instructor/andrewng',
      'Sarah Johnson': 'https://www.linkedin.com/learning/instructors'
    };
    
    handleOpenLink(instructorUrls[instructor.name], `${instructor.name}'s Profile`);
  };

  const handleQuizStart = async (course) => {
    try {
      router.push('/quiz');
    } catch (error) {
      console.error('Error starting quiz:', error);
      Alert.alert(
        'Error',
        'Unable to start the quiz. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const WebViewHeader = () => (
    <View style={styles.webViewHeader}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setWebViewVisible(false)}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Back to Explore</Text>
      </TouchableOpacity>
      <Text style={styles.webViewTitle} numberOfLines={1}>
        {webViewTitle}
      </Text>
    </View>
  );

  const featuredCourses = [
    {
      id: 1,
      title: 'Complete Python Bootcamp 2024',
      description: 'Master Python programming from basics to advanced concepts. Build real-world projects and learn industry best practices.',
      instructor: 'Dr. Angela Yu',
      rating: 4.9,
      students: '255.5k',
      price: '$89.99',
      icon: 'code',
      tags: ['Bestseller', 'Python', 'Programming'],
      highlights: ['100+ hours content', 'Certificate', '24/7 Support'],
      courseUrl: 'https://www.udemy.com/course/complete-python-bootcamp/',
      previewUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
      resources: [
        {
          title: 'Python Documentation',
          url: 'https://docs.python.org/3/'
        },
        {
          title: 'Practice Exercises',
          url: 'https://www.hackerrank.com/domains/python'
        }
      ]
    },
    {
      id: 2,
      title: 'Machine Learning A-Z',
      description: 'Complete machine learning course with Python and R. Includes deep learning, NLP, and real-world projects.',
      instructor: 'Prof. Andrew Ng',
      rating: 4.8,
      students: '195.3k',
      price: '$94.99',
      icon: 'brain',
      tags: ['AI', 'Machine Learning', 'Data Science'],
      highlights: ['60+ hours content', 'Real Projects', 'Industry Ready'],
      courseUrl: 'https://www.coursera.org/learn/machine-learning',
      previewUrl: 'https://www.youtube.com/watch?v=jGwO_UgTS7I',
      resources: [
        {
          title: 'TensorFlow Tutorials',
          url: 'https://www.tensorflow.org/tutorials'
        },
        {
          title: 'Kaggle Competitions',
          url: 'https://www.kaggle.com/competitions'
        }
      ]
    },
    {
      id: 3,
      title: 'Modern Web Development',
      description: 'Learn modern web development with React, Node.js, and modern JavaScript practices.',
      instructor: 'Max Schwarzmüller',
      rating: 4.9,
      students: '180.1k',
      price: '$94.99',
      icon: 'web',
      tags: ['Web Dev', 'React', 'JavaScript'],
      highlights: ['Complete Stack', 'Modern Tools', 'Real Projects'],
      courseUrl: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux',
      previewUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
      resources: [
        {
          title: 'React Documentation',
          url: 'https://react.dev/'
        },
        {
          title: 'MDN Web Docs',
          url: 'https://developer.mozilla.org/'
        }
      ]
    }
  ];

  const learningPaths = [
    {
      id: 1,
      title: 'Full-Stack Development',
      duration: '6 months',
      level: 'Intermediate',
      courses: 12,
      image: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1213.jpg'
    },
    {
      id: 2,
      title: 'Data Science',
      duration: '8 months',
      level: 'Advanced',
      courses: 15,
      image: 'https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-1481.jpg'
    }
  ];

  const liveWorkshops = [
    {
      id: 1,
      title: 'Building AI Applications',
      date: 'Tomorrow, 2:00 PM',
      instructor: 'Alex Morgan',
      participants: 1200,
      image: 'https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-1062.jpg'
    },
    {
      id: 2,
      title: 'Mastering React Native',
      date: 'Today, 7:00 PM',
      instructor: 'Emily Chen',
      participants: 800,
      image: 'https://img.freepik.com/free-vector/mobile-development-concept-illustration_114360-1363.jpg'
    }
  ];

  const topInstructors = [
    {
      id: 1,
      name: 'Dr. Angela Yu',
      expertise: 'Web Development',
      students: '1.2M',
      rating: 4.9,
      courses: 15,
      description: 'Lead instructor with 10+ years of teaching experience in web development and programming.',
      icon: 'laptop-code',
      specialties: ['JavaScript', 'Python', 'React']
    },
    {
      id: 2,
      name: 'Prof. Andrew Ng',
      expertise: 'Machine Learning',
      students: '950K',
      rating: 4.8,
      courses: 12,
      description: 'Stanford professor and AI researcher with extensive experience in machine learning.',
      icon: 'brain',
      specialties: ['AI', 'Deep Learning', 'Neural Networks']
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      expertise: 'UI/UX Design',
      students: '750K',
      rating: 4.9,
      courses: 18,
      description: 'Design leader with experience at top tech companies, specializing in user experience.',
      icon: 'pencil-ruler',
      specialties: ['Figma', 'UI Design', 'User Research']
    }
  ];

  const certifications = [
    {
      id: 1,
      title: 'Full Stack Developer',
      provider: 'Tech Academy',
      duration: '6 months',
      level: 'Advanced',
      price: '$499',
      image: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
    },
    {
      id: 2,
      title: 'Data Science Specialist',
      provider: 'Data Institute',
      duration: '8 months',
      level: 'Intermediate',
      price: '$599',
      image: 'https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-1481.jpg'
    }
  ];

  const successStories = [
    {
      id: 1,
      name: 'Michael Chen',
      role: 'Software Engineer at Google',
      story: 'Started as a beginner, now working at my dream company!',
      image: 'https://img.freepik.com/free-vector/successful-man-concept-illustration_114360-2087.jpg',
      course: 'Full Stack Development'
    },
    {
      id: 2,
      name: 'Emma Watson',
      role: 'UX Designer at Apple',
      story: 'Changed my career completely in just 6 months!',
      image: 'https://img.freepik.com/free-vector/successful-woman-concept-illustration_114360-2089.jpg',
      course: 'UI/UX Design Masterclass'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Career Fair 2024',
      date: 'Mar 15, 2024',
      time: '10:00 AM - 4:00 PM',
      type: 'Virtual',
      participants: 5000,
      image: 'https://img.freepik.com/free-vector/job-fair-concept-illustration_114360-1324.jpg'
    },
    {
      id: 2,
      title: 'Global Coding Challenge',
      date: 'Mar 20, 2024',
      time: '9:00 AM - 6:00 PM',
      type: 'Online',
      participants: 10000,
      image: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1213.jpg'
    }
  ];

  const onlinePlatforms = [
    {
      id: 1,
      name: 'Coursera',
      url: 'https://www.coursera.org',
      icon: 'school',
      description: 'Access courses from top universities worldwide',
      partners: ['Stanford', 'MIT', 'Yale']
    },
    {
      id: 2,
      name: 'edX',
      url: 'https://www.edx.org',
      icon: 'laptop-mac',
      description: 'Professional certificates and degree programs',
      partners: ['Harvard', 'Berkeley', 'Microsoft']
    },
    {
      id: 3,
      name: 'Udacity',
      url: 'https://www.udacity.com',
      icon: 'code',
      description: 'Industry-recognized nanodegree programs',
      partners: ['Google', 'AWS', 'IBM']
    }
  ];

  const freeResources = [
    {
      id: 1,
      name: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org',
      icon: 'code',
      topics: ['Web Development', 'JavaScript', 'Python']
    },
    {
      id: 2,
      name: 'Khan Academy',
      url: 'https://www.khanacademy.org',
      icon: 'school',
      topics: ['Math', 'Science', 'Computing']
    },
    {
      id: 3,
      name: 'MIT OpenCourseWare',
      url: 'https://ocw.mit.edu',
      icon: 'library-books',
      topics: ['Engineering', 'Science', 'Mathematics']
    }
  ];

  const LoadingOverlay = () => (
    isLoading ? (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Opening content...</Text>
      </View>
    ) : null
  );

  const handlePathPress = async (path) => {
    setExpandedPath(expandedPath === path.id ? null : path.id);
    // Track learning path interaction
    await ProgressTracker.updatePathProgress(
      path.id,
      path.title,
      0, // Initial exploration
      path.modules.length
    );
  };

  const handleModulePress = async (pathId, moduleId, moduleTitle) => {
    const path = learningPaths.find(p => p.id === pathId);
    if (path) {
      const completedModules = Math.min(moduleId, path.modules.length);
      await ProgressTracker.updatePathProgress(
        pathId,
        path.title,
        completedModules,
        path.modules.length
      );
      
      // Track course progress
      await ProgressTracker.trackCourseProgress(
        `${pathId}-${moduleId}`,
        moduleTitle,
        Math.round((completedModules / path.modules.length) * 100),
        path.category
      );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#1a1f2e', 'rgba(26, 31, 46, 0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.headerTitle}>Explore Learning</Text>
          <Text style={styles.headerSubtitle}>
            Discover courses, workshops, and resources to enhance your skills
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive
                ]}
                onPress={() => scrollToSection(filter)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive
                ]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Featured Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Courses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {featuredCourses.map((course) => (
              <TouchableOpacity 
                key={course.id} 
                style={styles.featuredCard}
                onPress={() => handleCoursePress(course)}
              >
                <View style={styles.courseHeader}>
                  <MaterialIcons name={course.icon} size={40} color={Colors.PRIMARY} />
                  <View style={styles.courseActions}>
                    <TouchableOpacity 
                      style={styles.previewButton}
                      onPress={() => handleOpenLink(course.previewUrl, `${course.title} - Preview`)}
                    >
                      <MaterialIcons name="play-circle-filled" size={24} color={Colors.PRIMARY} />
                      <Text style={styles.previewText}>Watch Preview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.quizButton}
                      onPress={() => handleQuizStart(course)}
                    >
                      <MaterialIcons name="assignment" size={24} color={Colors.PRIMARY} />
                      <Text style={styles.quizText}>Take Quiz</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.courseContent}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDescription}>{course.description}</Text>
                  <Text style={styles.instructorName}>by {course.instructor}</Text>

                  <View style={styles.resourcesContainer}>
                    <Text style={styles.resourcesTitle}>Learning Resources:</Text>
                    {course.resources.map((resource, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.resourceLink}
                        onPress={() => handleOpenLink(resource.url, resource.title)}
                      >
                        <MaterialIcons name="link" size={16} color={Colors.PRIMARY} />
                        <Text style={styles.resourceText}>{resource.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.courseFooter}>
                    <View style={styles.statsContainer}>
                      <View style={styles.rating}>
                        <MaterialIcons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{course.rating}</Text>
                      </View>
                      <Text style={styles.studentsText}>{course.students} students</Text>
                    </View>
                    <Text style={styles.priceText}>{course.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Online Learning Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Platforms</Text>
          <View style={styles.platformsGrid}>
            {onlinePlatforms.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                style={styles.platformCard}
                onPress={() => handleOpenLink(platform.url, platform.name)}
              >
                <MaterialIcons name={platform.icon} size={32} color={Colors.PRIMARY} />
                <Text style={styles.platformName}>{platform.name}</Text>
                <Text style={styles.platformDescription}>{platform.description}</Text>
                <View style={styles.partnersContainer}>
                  {platform.partners.map((partner, index) => (
                    <Text key={index} style={styles.partnerText}>• {partner}</Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Free Learning Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Free Resources</Text>
          {freeResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceCard}
              onPress={() => handleOpenLink(resource.url, resource.name)}
            >
              <MaterialIcons name={resource.icon} size={32} color={Colors.PRIMARY} />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <View style={styles.topicsContainer}>
                  {resource.topics.map((topic, index) => (
                    <View key={index} style={styles.topicTag}>
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Section */}
        <View ref={sectionRefs.Popular} style={styles.section}>
          <Text style={styles.sectionTitle}>Top Instructors</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.instructorsScroll}>
            {topInstructors.map((instructor) => (
              <TouchableOpacity 
                key={instructor.id} 
                style={styles.instructorCard}
                onPress={() => handleInstructorPress(instructor)}
              >
                <View style={styles.instructorIconContainer}>
                  <FontAwesome5 name={instructor.icon} size={40} color={Colors.PRIMARY} />
                </View>
                <View style={styles.instructorContent}>
                  <Text style={styles.instructorName}>{instructor.name}</Text>
                  <Text style={styles.instructorExpertise}>{instructor.expertise}</Text>
                  <Text style={styles.instructorDescription}>{instructor.description}</Text>
                  
                  {instructor.specialties && instructor.specialties.length > 0 && (
                    <View style={styles.specialtiesContainer}>
                      {instructor.specialties.map((specialty, index) => (
                        <View key={index} style={styles.specialtyTag}>
                          <Text style={styles.specialtyText}>{specialty}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.instructorStats}>
                    <View style={styles.statItem}>
                      <AntDesign name="user" size={16} color={Colors.PRIMARY} />
                      <Text style={styles.statText}>{instructor.students}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MaterialIcons name="book" size={16} color={Colors.PRIMARY} />
                      <Text style={styles.statText}>{instructor.courses} courses</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Newest Section */}
        <View ref={sectionRefs.Newest} style={styles.section}>
          <Text style={styles.sectionTitle}>Newest Additions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {/* Add your newest courses here */}
          </ScrollView>
        </View>

        {/* Trending Section */}
        <View ref={sectionRefs.Trending} style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {featuredCourses.filter(course => course.tags.includes('Trending')).map((course) => (
              <TouchableOpacity key={course.id} style={styles.featuredCard}>
                <Image source={{ uri: course.image }} style={styles.featuredImage} />
                <View style={styles.featuredContent}>
                  <View style={styles.tagContainer}>
                    {course.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.featuredTitle}>{course.title}</Text>
                  <Text style={styles.instructorName}>{course.instructor}</Text>
                  <View style={styles.courseStats}>
                    <View style={styles.rating}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{course.rating}</Text>
                    </View>
                    <Text style={styles.studentsText}>{course.students} students</Text>
                    <Text style={styles.priceText}>{course.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Rated Section */}
        <View ref={sectionRefs['Top Rated']} style={styles.section}>
          <Text style={styles.sectionTitle}>Top Rated Courses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {featuredCourses.filter(course => course.rating >= 4.8).map((course) => (
              <TouchableOpacity key={course.id} style={styles.featuredCard}>
                <Image source={{ uri: course.image }} style={styles.featuredImage} />
                <View style={styles.featuredContent}>
                  <View style={styles.tagContainer}>
                    {course.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.featuredTitle}>{course.title}</Text>
                  <Text style={styles.instructorName}>{course.instructor}</Text>
                  <View style={styles.courseStats}>
                    <View style={styles.rating}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{course.rating}</Text>
                    </View>
                    <Text style={styles.studentsText}>{course.students} students</Text>
                    <Text style={styles.priceText}>{course.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={[
                  styles.categoryCard, 
                  { backgroundColor: category.backgroundColor },
                  selectedCategory === category.title && styles.categoryCardSelected
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryIcon}>
                  {category.icon}
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryCount}>{category.courses} courses</Text>
                {categoryContent[category.title]?.popularTopics && (
                  <View style={styles.topicsPreview}>
                    {categoryContent[category.title].popularTopics.slice(0, 2).map((topic, index) => (
                      <View key={index} style={styles.topicChip}>
                        <Text style={styles.topicChipText}>{topic}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Learning Paths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Paths</Text>
          {learningPaths.map((path) => (
            <View key={path.id} style={styles.pathCard}>
              <TouchableOpacity
                style={styles.pathHeader}
                onPress={() => handlePathPress(path)}
              >
                <View>
                  <Text style={styles.pathTitle}>{path.title}</Text>
                  <Text style={styles.pathDescription}>{path.description}</Text>
                </View>
                <MaterialIcons
                  name={expandedPath === path.id ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={Colors.PRIMARY}
                />
              </TouchableOpacity>
              {expandedPath === path.id && (
                <View style={styles.modulesList}>
                  {path.modules.map(module => (
                    <TouchableOpacity
                      key={module.id}
                      style={styles.moduleItem}
                      onPress={() => handleModulePress(path.id, module.id, module.title)}
                    >
                      <MaterialIcons name="school" size={20} color={Colors.PRIMARY} />
                      <View style={styles.moduleInfo}>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                        <Text style={styles.moduleDuration}>{module.duration}</Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Professional Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Certifications</Text>
          {certifications.map((cert) => (
            <TouchableOpacity 
              key={cert.id} 
              style={styles.certCard}
              onPress={() => handleCertificationPress(cert)}
            >
              <Image source={{ uri: cert.image }} style={styles.certImage} />
              <View style={styles.certContent}>
                <Text style={styles.certTitle}>{cert.title}</Text>
                <Text style={styles.certProvider}>{cert.provider}</Text>
                <View style={styles.certDetails}>
                  <View style={styles.certDetail}>
                    <MaterialIcons name="timer" size={16} color={Colors.PRIMARY} />
                    <Text style={styles.detailText}>{cert.duration}</Text>
                  </View>
                  <View style={styles.certDetail}>
                    <MaterialIcons name="bar-chart" size={16} color={Colors.PRIMARY} />
                    <Text style={styles.detailText}>{cert.level}</Text>
                  </View>
                </View>
                <Text style={styles.certPrice}>{cert.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Workshops */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Workshops</Text>
          {liveWorkshops.map((workshop) => (
            <TouchableOpacity 
              key={workshop.id} 
              style={styles.workshopCard}
              onPress={() => handleWorkshopPress(workshop)}
            >
              <Image source={{ uri: workshop.image }} style={styles.workshopImage} />
              <View style={styles.workshopContent}>
                <View style={styles.liveTag}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.workshopTitle}>{workshop.title}</Text>
                <Text style={styles.workshopInstructor}>{workshop.instructor}</Text>
                <Text style={styles.workshopDate}>{workshop.date}</Text>
                <Text style={styles.workshopParticipants}>
                  {workshop.participants} participants
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Success Stories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Success Stories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {successStories.map((story) => (
              <TouchableOpacity 
                key={story.id} 
                style={styles.storyCard}
                onPress={() => handleStoryPress(story)}
              >
                <Image source={{ uri: story.image }} style={styles.storyImage} />
                <View style={styles.storyContent}>
                  <Text style={styles.storyName}>{story.name}</Text>
                  <Text style={styles.storyRole}>{story.role}</Text>
                  <Text style={styles.storyCourse}>{story.course}</Text>
                  <Text style={styles.storyText}>"{story.story}"</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {upcomingEvents.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => handleEventPress(event)}
            >
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <View style={styles.eventTypeTag}>
                  <Text style={styles.eventTypeText}>{event.type}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetail}>
                    <MaterialIcons name="event" size={16} color={Colors.PRIMARY} />
                    <Text style={styles.eventDetailText}>{event.date}</Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <MaterialIcons name="access-time" size={16} color={Colors.PRIMARY} />
                    <Text style={styles.eventDetailText}>{event.time}</Text>
                  </View>
                </View>
                <Text style={styles.eventParticipants}>
                  {event.participants.toLocaleString()} participants registered
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Back Navigation Button - Shows when viewing external content */}
      {isExternalContent && !isWeb && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setIsExternalContent(false)}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back to Explore</Text>
        </TouchableOpacity>
      )}

      {/* Loading Overlay */}
      <LoadingOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#1a1f2e',
  },
  gradient: {
    flex: 1,
    paddingTop: isWeb ? 40 : 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: '500',
  },
  filterScroll: {
    marginTop: 15,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filterButtonActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.4,
  },
  filterText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 200, // Adjusted from 250 to 200
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  featuredScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  featuredCard: {
    width: isWeb ? 400 : width - 60,
    marginRight: 20,
    backgroundColor: '#232838',
    borderRadius: 16,
    padding: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 15,
    color: '#e0e0e0',
    lineHeight: 22,
    marginBottom: 12,
  },
  highlightsContainer: {
    marginVertical: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 14,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  ratingText: {
    marginLeft: 4,
    color: '#FFD700',
    fontSize: 15,
    fontWeight: 'bold',
  },
  studentsText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  instructorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  instructorExpertise: {
    fontSize: 16,
    color: Colors.PRIMARY,
    marginBottom: 8,
    fontWeight: '600',
  },
  instructorDescription: {
    fontSize: 15,
    color: '#e0e0e0',
    lineHeight: 22,
    marginVertical: 8,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  specialtyTag: {
    backgroundColor: 'rgba(0, 255, 149, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  specialtyText: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  instructorCard: {
    width: isWeb ? 350 : width - 80,
    marginRight: 20,
    backgroundColor: '#232838',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  instructorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  instructorContent: {
    flex: 1,
  },
  instructorsScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  certCard: {
    flexDirection: 'row',
    backgroundColor: '#232838',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
  },
  certImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  certContent: {
    flex: 1,
    padding: 16,
  },
  certTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  certProvider: {
    fontSize: 14,
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  certDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  certDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    color: '#fff',
    fontSize: 14,
  },
  certPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  storiesScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  storyCard: {
    width: isWeb ? 350 : width - 80,
    marginRight: 20,
    backgroundColor: '#232838',
    borderRadius: 16,
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  storyContent: {
    padding: 16,
  },
  storyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  storyRole: {
    fontSize: 14,
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  storyCourse: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 8,
  },
  storyText: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#232838',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
  },
  eventImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTypeTag: {
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  eventTypeText: {
    color: Colors.PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDetailText: {
    marginLeft: 4,
    color: '#fff',
    fontSize: 14,
  },
  eventParticipants: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  pathsScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  pathCard: {
    width: isWeb ? 300 : width - 100,
    marginRight: 20,
    backgroundColor: '#232838',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  pathTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  pathDescription: {
    fontSize: 14,
    color: '#f0f0f0',
  },
  modulesList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  moduleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  moduleTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  moduleDuration: {
    fontSize: 14,
    color: '#888',
  },
  workshopCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workshopImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  workshopContent: {
    flex: 1,
    padding: 16,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  workshopTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  workshopInstructor: {
    fontSize: 14,
    color: Colors.PRIMARY,
  },
  workshopDate: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 4,
  },
  workshopParticipants: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  categoryCard: {
    width: isWeb ? '31%' : '47%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewText: {
    color: Colors.PRIMARY,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  resourcesContainer: {
    marginVertical: 12,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resourceText: {
    color: Colors.PRIMARY,
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  platformCard: {
    width: isWeb ? '31%' : '47%',
    backgroundColor: '#232838',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  platformName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 8,
    textAlign: 'center',
  },
  platformDescription: {
    fontSize: 15,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  partnersContainer: {
    alignItems: 'center',
  },
  partnerText: {
    color: Colors.PRIMARY,
    fontSize: 15,
    marginVertical: 2,
    fontWeight: '500',
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232838',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  resourceContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  resourceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicTag: {
    backgroundColor: 'rgba(0, 255, 149, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  topicText: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232838',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  webViewTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    marginRight: 56, // Balance with back button
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  courseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  courseActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quizText: {
    color: Colors.PRIMARY,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryCardSelected: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    transform: [{ scale: 1.02 }],
  },
  topicsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  topicChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topicChipText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
  },
}); 