import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Animated, Image, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import ResponsiveContainer from '../../components/ResponsiveContainer';

const isWeb = Platform.OS === 'web';
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = Layout.isWeb ? Math.min(width * 0.85, 400) : width * 0.85;

// Helper function for haptic feedback
const triggerHaptic = async () => {
  if (!isWeb) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptics not available');
    }
  }
};

export default function Home() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselScrollX = useRef(new Animated.Value(0)).current;
  const headerScaleAnim = useRef(new Animated.Value(1)).current;
  const headerRotateAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;

  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentStreak, setCurrentStreak] = useState(7); // Days
  const [longestStreak, setLongestStreak] = useState(14); // Days

  // Featured carousel data
  const carouselData = [
    {
      id: 1,
      title: "Summer Coding Bootcamp",
      icon: "code",
      iconFamily: "FontAwesome5",
      description: "Intensive 12-week program",
      startDate: "Starts July 1st",
      gradient: ['#FF6B6B', '#4ECDC4']
    },
    {
      id: 2,
      title: "Design Workshop Series",
      icon: "bezier-curve",
      iconFamily: "FontAwesome5",
      description: "Learn from industry experts",
      startDate: "Weekly sessions",
      gradient: ['#A8E6CF', '#1B9CFC']
    },
    {
      id: 3,
      title: "AI & Machine Learning",
      icon: "brain",
      iconFamily: "FontAwesome5",
      description: "Future of Technology",
      startDate: "Enroll Now",
      gradient: ['#FF9A9E', '#FAD0C4']
    }
  ];

  // Categories
  const categories = [
    'All', 'Popular', 'Trending', 'New', 'Top Rated'
  ];

  // Course data
  const courses = [
    {
      id: 1,
      title: "Complete Web Development",
      instructor: "John Smith",
      rating: 4.9,
      students: 15420,
      image: require('../../assets/images/logo2.jpg'),
      progress: 65,
      category: 'Popular'
    },
    {
      id: 2,
      title: "Mobile App Development",
      instructor: "Sarah Johnson",
      rating: 4.8,
      students: 12350,
      image: require('../../assets/images/logo1.jpg'),
      progress: 32,
      category: 'Trending'
    },
    {
      id: 3,
      title: "UI/UX Masterclass",
      instructor: "Mike Chen",
      rating: 4.7,
      students: 8940,
      image: require('../../assets/images/logo2.jpg'),
      progress: 89,
      category: 'New'
    }
  ];

  // Learning stats
  const learningStats = [
    {
      id: 1,
      title: "Hours Learned",
      value: "32.5",
      icon: "timer",
      trend: "+2.5",
      trendUp: true
    },
    {
      id: 2,
      title: "Courses",
      value: "12",
      icon: "school",
      trend: "+3",
      trendUp: true
    },
    {
      id: 3,
      title: "Certificates",
      value: "4",
      icon: "emoji-events",
      trend: "New",
      trendUp: true
    }
  ];

  // Learning paths
  const learningPaths = [
    {
      id: 1,
      title: "Web Development",
      progress: 65,
      icon: "web",
      totalCourses: 12,
      completedCourses: 8,
      gradient: ['#4CAF50', '#2196F3']
    },
    {
      id: 2,
      title: "Mobile Development",
      progress: 45,
      icon: "mobile-alt",
      totalCourses: 10,
      completedCourses: 4,
      gradient: ['#FF9800', '#F44336']
    },
    {
      id: 3,
      title: "Data Science",
      progress: 30,
      icon: "chart-line",
      totalCourses: 15,
      completedCourses: 5,
      gradient: ['#9C27B0', '#673AB7']
    }
  ];

  // Weekly goals
  const weeklyGoals = [
    {
      id: 1,
      title: "Study Hours",
      current: 12,
      target: 20,
      icon: "timer",
      unit: "hours"
    },
    {
      id: 2,
      title: "Practice Problems",
      current: 25,
      target: 50,
      icon: "code",
      unit: "problems"
    },
    {
      id: 3,
      title: "Quiz Score",
      current: 85,
      target: 100,
      icon: "school",
      unit: "%"
    }
  ];

  // Achievements
  const achievements = [
    {
      id: 1,
      title: "Quick Learner",
      description: "Completed 5 lessons in one day",
      icon: "flash-on",
      progress: 100
    },
    {
      id: 2,
      title: "Coding Ninja",
      description: "Solved 10 coding challenges",
      icon: "code",
      progress: 80
    }
  ];

  // Add new sections data
  const quickActions = [
    {
      id: 1,
      title: "Continue Learning",
      icon: "play-circle",
      color: "#4CAF50",
      route: "/course/latest"
    },
    {
      id: 2,
      title: "Practice Quiz",
      icon: "help-circle",
      color: "#2196F3",
      route: "/quiz"
    },
    {
      id: 3,
      title: "Study Group",
      icon: "users",
      color: "#9C27B0",
      route: "/groups"
    },
    {
      id: 4,
      title: "Resources",
      icon: "book",
      color: "#FF9800",
      route: "/resources"
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "JavaScript Final Project",
      dueDate: "2024-03-20",
      progress: 75,
      priority: "high"
    },
    {
      id: 2,
      title: "UI Design Assignment",
      dueDate: "2024-03-25",
      progress: 45,
      priority: "medium"
    }
  ];

  // Calculate days remaining
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(due - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();

    // Add header animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(headerScaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(headerScaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(headerRotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(headerRotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Add streak animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(streakAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(streakAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const headerRotate = headerRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handlePress = (action) => {
    triggerHaptic();
    if (action === '/quiz') {
      router.push('/quiz');
    } else if (action) {
      router.push(action);
    }
  };

  const renderCarouselItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];

    const scale = carouselScrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp'
    });

    const opacity = carouselScrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={[styles.carouselItem, { transform: [{ scale }], opacity }]}>
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.carouselGradient}
        >
          <View style={styles.carouselIconContainer}>
            <FontAwesome5 name={item.icon} size={48} color="#fff" />
          </View>
          <View style={styles.carouselContent}>
            <Text style={styles.carouselTitle}>{item.title}</Text>
            <Text style={styles.carouselDescription}>{item.description}</Text>
            <View style={styles.carouselFooter}>
              <Text style={styles.carouselDate}>{item.startDate}</Text>
              <TouchableOpacity 
                style={styles.carouselButton}
                onPress={() => handlePress('learnMore')}
              >
                <Text style={styles.carouselButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderCourseCard = ({ item }) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return null;

    return (
      <Animated.View style={[styles.courseCard, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={item.image} style={styles.courseImage} />
        <View style={styles.courseContent}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          <Text style={styles.instructorName}>by {item.instructor}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}% Complete</Text>
          </View>
          <View style={styles.courseFooter}>
            <View style={styles.studentsContainer}>
              <MaterialIcons name="people" size={16} color={Colors.PRIMARY} />
              <Text style={styles.studentsText}>{(item.students / 1000).toFixed(1)}k</Text>
            </View>
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderStreakFlame = () => {
    const scale = streakAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2]
    });

    return (
      <Animated.View style={[styles.streakFlame, { transform: [{ scale }] }]}>
        <MaterialCommunityIcons name="fire" size={32} color="#FF6B6B" />
      </Animated.View>
    );
  };

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        <LinearGradient
          colors={['#232838', '#1a1f2e']}
          style={[styles.header, { height: Layout.header.height + Layout.header.paddingTop }]}
        >
          <View style={[styles.headerContent, { paddingTop: Layout.header.paddingTop }]}>
            <View style={styles.headerLeft}>
              <Animated.View style={[styles.logoContainer, { transform: [{ scale: headerScaleAnim }] }]}>
                <View style={styles.logoBackground}>
                  <FontAwesome5 name="graduation-cap" size={24} color={Colors.PRIMARY} />
                </View>
              </Animated.View>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>Welcome back!</Text>
                <Text style={styles.userName}>John Doe</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => handlePress('search')}
              >
                <MaterialIcons name="search" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => handlePress('notifications')}
              >
                <MaterialIcons name="notifications" size={24} color="#fff" />
                <Animated.View 
                  style={[
                    styles.notificationBadge,
                    { transform: [{ rotate: headerRotate }] }
                  ]} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>
              <View style={[
                styles.quickActionsGrid,
                Layout.isWeb && styles.webQuickActionsGrid
              ]}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.quickActionCard,
                      Layout.isWeb && styles.webQuickActionCard
                    ]}
                    onPress={() => handlePress(action.route)}
                  >
                    <Animated.View
                      style={[
                        styles.quickActionIcon,
                        { backgroundColor: action.color }
                      ]}
                    >
                      <Feather name={action.icon} size={24} color="#fff" />
                    </Animated.View>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Featured Carousel */}
            <View style={styles.carouselContainer}>
              <FlatList
                data={carouselData}
                renderItem={renderCarouselItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: carouselScrollX } } }],
                  { useNativeDriver: true }
                )}
              />
              <View style={styles.paginationDots}>
                {carouselData.map((_, index) => {
                  const inputRange = [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width
                  ];

                  const dotWidth = carouselScrollX.interpolate({
                    inputRange,
                    outputRange: [8, 16, 8],
                    extrapolate: 'clamp'
                  });

                  const opacity = carouselScrollX.interpolate({
                    inputRange,
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp'
                  });

                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.dot,
                        { width: dotWidth, opacity }
                      ]}
                    />
                  );
                })}
              </View>
            </View>

            {/* Learning Stats */}
            <View style={styles.statsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {learningStats.map((stat) => (
                  <View key={stat.id} style={styles.statCard}>
                    <MaterialIcons name={stat.icon} size={24} color={Colors.PRIMARY} />
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                    <View style={[styles.trendBadge, { backgroundColor: stat.trendUp ? '#4CAF50' : '#FF5252' }]}>
                      <Text style={styles.trendText}>{stat.trend}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category && styles.categoryTextActive
                    ]}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Courses */}
            <View style={styles.coursesContainer}>
              <FlatList
                data={courses}
                renderItem={renderCourseCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>

            {/* Upcoming Deadlines */}
            <View style={styles.deadlinesContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {upcomingDeadlines.map((deadline) => (
                <Animated.View
                  key={deadline.id}
                  style={[styles.deadlineCard, { transform: [{ scale: scaleAnim }] }]}
                >
                  <LinearGradient
                    colors={
                      deadline.priority === 'high'
                        ? ['#FF5252', '#FF1744']
                        : ['#FFA726', '#FB8C00']
                    }
                    style={styles.deadlinePriorityIndicator}
                  />
                  <View style={styles.deadlineContent}>
                    <Text style={styles.deadlineTitle}>{deadline.title}</Text>
                    <View style={styles.deadlineInfo}>
                      <View style={styles.deadlineProgress}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${deadline.progress}%` }
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>{deadline.progress}%</Text>
                      </View>
                      <View style={styles.deadlineTimeRemaining}>
                        <MaterialIcons name="access-time" size={16} color={Colors.PRIMARY} />
                        <Text style={styles.deadlineTimeText}>
                          {getDaysRemaining(deadline.dueDate)} days left
                        </Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>

            {/* Learning Paths */}
            <View style={styles.learningPathsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Learning Paths</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {learningPaths.map((path) => (
                <Animated.View
                  key={path.id}
                  style={[styles.learningPathCard, { transform: [{ scale: scaleAnim }] }]}
                >
                  <View style={styles.pathIcon}>
                    <MaterialIcons name={path.icon} size={24} color={Colors.PRIMARY} />
                  </View>
                  <View style={styles.pathInfo}>
                    <Text style={styles.pathTitle}>{path.title}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${path.progress}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{path.progress}%</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>

            {/* Weekly Goals */}
            <View style={styles.weeklyGoalsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Weekly Goals</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {weeklyGoals.map((goal) => (
                <Animated.View
                  key={goal.id}
                  style={[styles.goalCard, { transform: [{ scale: scaleAnim }] }]}
                >
                  <View style={styles.goalIcon}>
                    <MaterialIcons name={goal.icon} size={24} color={Colors.PRIMARY} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.current} {goal.unit} / {goal.target} {goal.unit}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>

            {/* Achievements */}
            <View style={styles.achievementsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Achievements</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {achievements.map((achievement) => (
                <Animated.View
                  key={achievement.id}
                  style={[styles.achievementCard, { transform: [{ scale: scaleAnim }] }]}
                >
                  <View style={styles.achievementIcon}>
                    <MaterialIcons name={achievement.icon} size={24} color={Colors.PRIMARY} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <View style={styles.achievementProgress}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${achievement.progress}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{achievement.progress}%</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>

            {/* Study Streak */}
            <View style={styles.streakContainer}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.streakCard}
              >
                {renderStreakFlame()}
                <View style={styles.streakContent}>
                  <Text style={styles.streakTitle}>Study Streak</Text>
                  <Text style={styles.streakCount}>{currentStreak} Days</Text>
                  <View style={styles.streakInfo}>
                    <View style={styles.streakStat}>
                      <Text style={styles.streakLabel}>Current</Text>
                      <Text style={styles.streakValue}>{currentStreak} days</Text>
                    </View>
                    <View style={styles.streakDivider} />
                    <View style={styles.streakStat}>
                      <Text style={styles.streakLabel}>Longest</Text>
                      <Text style={styles.streakValue}>{longestStreak} days</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.streakButton}
                    onPress={() => handlePress('viewProgress')}
                  >
                    <Text style={styles.streakButtonText}>View Progress</Text>
                  </TouchableOpacity>
                </View>

                {/* Decorative Elements */}
                <View style={[styles.decorativeCircle, styles.circle1]} />
                <View style={[styles.decorativeCircle, styles.circle2]} />
                <View style={[styles.decorativeCircle, styles.circle3]} />
              </LinearGradient>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  header: {
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.large,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: Layout.bottomTabHeight,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Layout.padding.medium,
  },
  webQuickActionsGrid: {
    justifyContent: 'flex-start',
    marginHorizontal: -Layout.padding.medium,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Layout.borderRadius.large,
    padding: Layout.padding.large,
    marginBottom: Layout.padding.large,
  },
  webQuickActionCard: {
    width: 200,
    marginHorizontal: Layout.padding.medium,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  logoBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  headerText: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.PRIMARY,
  },
  content: {
    flex: 1,
  },
  carouselContainer: {
    height: 220,
    marginVertical: 20,
  },
  carouselItem: {
    width: width,
    height: 200,
    paddingHorizontal: 20,
  },
  carouselGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  carouselIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  carouselDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 12,
  },
  carouselFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carouselDate: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  carouselButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  carouselButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.PRIMARY,
    marginHorizontal: 4,
  },
  statsContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  trendText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  categoriesContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: Colors.PRIMARY,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#000',
    fontWeight: '500',
  },
  coursesContainer: {
    paddingHorizontal: 20,
  },
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  instructorName: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentsText: {
    color: '#f0f0f0',
    marginLeft: 4,
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  learningPathsContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    color: Colors.PRIMARY,
    fontSize: 14,
  },
  learningPathCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  pathIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  weeklyGoalsContainer: {
    padding: 20,
  },
  goalCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  achievementsContainer: {
    padding: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
    marginBottom: 8,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionsContainer: {
    padding: 20,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Layout.borderRadius.large,
    padding: Layout.padding.large,
    marginBottom: Layout.padding.large,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  deadlinesContainer: {
    padding: 20,
  },
  deadlineCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  deadlinePriorityIndicator: {
    width: 4,
    height: '100%',
  },
  deadlineContent: {
    flex: 1,
    padding: 16,
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  deadlineInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineProgress: {
    flex: 1,
    marginRight: 16,
  },
  deadlineTimeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineTimeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  streakContainer: {
    padding: 20,
  },
  streakCard: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  streakFlame: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  streakContent: {
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  streakCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakStat: {
    alignItems: 'center',
    flex: 1,
  },
  streakLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  streakDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  streakButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  streakButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 100,
    height: 100,
    top: -20,
    left: -20,
  },
  circle2: {
    width: 60,
    height: 60,
    bottom: 20,
    right: -10,
  },
  circle3: {
    width: 40,
    height: 40,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
}); 