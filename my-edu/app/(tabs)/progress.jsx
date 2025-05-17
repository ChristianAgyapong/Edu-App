import { View, Text, ScrollView, StyleSheet, Platform, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const isWeb = Platform.OS === 'web';

export default function Progress() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [learningStats, setLearningStats] = useState({
    totalHours: 32.5,
    coursesStarted: 12,
    coursesCompleted: 4,
    quizzesTaken: 15,
    averageScore: 85,
    streak: 7
  });

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Fast Learner',
      description: 'Completed 3 lessons in one day',
      icon: <MaterialIcons name="speed" size={24} color={Colors.PRIMARY} />,
      unlockedDate: '2024-03-10'
    },
    {
      id: 2,
      title: 'Perfect Score',
      description: 'Got 100% in a quiz',
      icon: <MaterialIcons name="stars" size={24} color={Colors.PRIMARY} />,
      unlockedDate: '2024-03-08'
    },
    {
      id: 3,
      title: 'Coding Ninja',
      description: 'Completed 10 programming exercises',
      icon: <FontAwesome5 name="laptop-code" size={24} color={Colors.PRIMARY} />,
      unlockedDate: '2024-03-05'
    }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'course_progress',
      title: 'Complete Web Development',
      detail: 'Completed Module 5: Advanced CSS',
      timestamp: '2 hours ago',
      progress: 65
    },
    {
      id: 2,
      type: 'quiz_completed',
      title: 'JavaScript Fundamentals',
      detail: 'Scored 92%',
      timestamp: '1 day ago',
      score: 92
    },
    {
      id: 3,
      type: 'certificate_earned',
      title: 'UI/UX Design Basics',
      detail: 'Certificate earned',
      timestamp: '3 days ago'
    }
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderActivityIcon = (type) => {
    switch (type) {
      case 'course_progress':
        return <MaterialIcons name="school" size={24} color={Colors.PRIMARY} />;
      case 'quiz_completed':
        return <MaterialIcons name="assignment" size={24} color={Colors.PRIMARY} />;
      case 'certificate_earned':
        return <MaterialIcons name="emoji-events" size={24} color={Colors.PRIMARY} />;
      default:
        return <MaterialIcons name="info" size={24} color={Colors.PRIMARY} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Learning Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="timer" size={24} color={Colors.PRIMARY} />
              <Text style={styles.statNumber}>{learningStats.totalHours}h</Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="school" size={24} color={Colors.PRIMARY} />
              <Text style={styles.statNumber}>{learningStats.coursesStarted}</Text>
              <Text style={styles.statLabel}>Courses Started</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="done-all" size={24} color={Colors.PRIMARY} />
              <Text style={styles.statNumber}>{learningStats.coursesCompleted}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          {/* Additional Stats */}
          <View style={styles.additionalStats}>
            <View style={styles.statRow}>
              <MaterialIcons name="assignment" size={20} color={Colors.PRIMARY} />
              <Text style={styles.statLabel}>Quizzes Taken:</Text>
              <Text style={styles.statValue}>{learningStats.quizzesTaken}</Text>
            </View>
            <View style={styles.statRow}>
              <MaterialIcons name="analytics" size={20} color={Colors.PRIMARY} />
              <Text style={styles.statLabel}>Average Score:</Text>
              <Text style={styles.statValue}>{learningStats.averageScore}%</Text>
            </View>
            <View style={styles.statRow}>
              <MaterialIcons name="local-fire-department" size={20} color={Colors.PRIMARY} />
              <Text style={styles.statLabel}>Day Streak:</Text>
              <Text style={styles.statValue}>{learningStats.streak} days</Text>
            </View>
          </View>

          {/* Recent Activities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            {recentActivities.map(activity => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  {renderActivityIcon(activity.type)}
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDetail}>{activity.detail}</Text>
                  <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                  {activity.progress && (
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBar, { width: `${activity.progress}%` }]} />
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {achievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  {achievement.icon}
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <Text style={styles.achievementDate}>Unlocked: {achievement.unlockedDate}</Text>
                </View>
              </View>
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
    padding: 20,
    paddingTop: isWeb ? 40 : 20,
    backgroundColor: '#232838',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#f0f0f0',
    textAlign: 'center',
  },
  additionalStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  activityDetail: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 4,
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 2,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
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
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#888',
  },
}); 