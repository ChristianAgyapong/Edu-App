import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const isWeb = Platform.OS === 'web';

export default function Explore() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const categories = [
    {
      id: 1,
      title: 'Development',
      icon: <FontAwesome5 name="laptop-code" size={24} color={Colors.PRIMARY} />,
      courses: 120
    },
    {
      id: 2,
      title: 'Design',
      icon: <MaterialIcons name="design-services" size={24} color={Colors.PRIMARY} />,
      courses: 85
    },
    {
      id: 3,
      title: 'Business',
      icon: <MaterialIcons name="business-center" size={24} color={Colors.PRIMARY} />,
      courses: 95
    },
    {
      id: 4,
      title: 'Marketing',
      icon: <MaterialIcons name="trending-up" size={24} color={Colors.PRIMARY} />,
      courses: 70
    },
    {
      id: 5,
      title: 'Photography',
      icon: <MaterialIcons name="camera-alt" size={24} color={Colors.PRIMARY} />,
      courses: 45
    },
    {
      id: 6,
      title: 'Music',
      icon: <MaterialIcons name="music-note" size={24} color={Colors.PRIMARY} />,
      courses: 60
    }
  ];

  const trendingCourses = [
    {
      id: 1,
      title: 'Complete Web Development 2024',
      instructor: 'John Smith',
      rating: 4.9,
      students: '15.5k',
      price: '$89.99',
      image: '💻'
    },
    {
      id: 2,
      title: 'UI/UX Design Masterclass',
      instructor: 'Sarah Johnson',
      rating: 4.8,
      students: '12.3k',
      price: '$79.99',
      image: '🎨'
    },
    {
      id: 3,
      title: 'Digital Marketing Pro',
      instructor: 'Mike Wilson',
      rating: 4.7,
      students: '10.1k',
      price: '$69.99',
      image: '📱'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Courses</Text>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryIcon}>
                    {category.icon}
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryCount}>{category.courses} courses</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Trending Courses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            {trendingCourses.map((course) => (
              <TouchableOpacity key={course.id} style={styles.courseCard}>
                <View style={styles.courseImage}>
                  <Text style={styles.courseEmoji}>{course.image}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.instructorName}>{course.instructor}</Text>
                  <View style={styles.courseStats}>
                    <View style={styles.rating}>
                      <MaterialIcons name="star" size={16} color={Colors.PRIMARY} />
                      <Text style={styles.ratingText}>{course.rating}</Text>
                    </View>
                    <Text style={styles.studentsText}>{course.students} students</Text>
                    <Text style={styles.priceText}>{course.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  categoryCard: {
    width: isWeb ? '31%' : '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  courseEmoji: {
    fontSize: 32,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: Colors.PRIMARY,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  studentsText: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
}); 