import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Animated, Image, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';

const isWeb = Platform.OS === 'web';
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export default function Home() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselScrollX = useRef(new Animated.Value(0)).current;

  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Featured carousel data
  const carouselData = [
    {
      id: 1,
      title: "Summer Coding Bootcamp",
      image: require('../../assets/images/logo1.jpg'),
      description: "Intensive 12-week program",
      startDate: "Starts July 1st"
    },
    {
      id: 2,
      title: "Design Workshop Series",
      image: require('../../assets/images/logo2.jpg'),
      description: "Learn from industry experts",
      startDate: "Weekly sessions"
    },
    {
      id: 3,
      title: "AI & Machine Learning",
      image: require('../../assets/images/logo1.jpg'),
      description: "Future of Technology",
      startDate: "Enroll Now"
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
  }, []);

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
        <Image source={item.image} style={styles.carouselImage} />
        <View style={styles.carouselContent}>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselDescription}>{item.description}</Text>
          <View style={styles.carouselFooter}>
            <Text style={styles.carouselDate}>{item.startDate}</Text>
            <TouchableOpacity style={styles.carouselButton}>
              <Text style={styles.carouselButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/images/logo1.jpg')} style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#fff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: isWeb ? 40 : 20,
    backgroundColor: '#232838',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
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
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    position: 'absolute',
  },
  carouselContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
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
  achievementsContainer: {
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
  }
}); 