import { View, Text, ScrollView, StyleSheet, Platform, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import ProgressTracker from '../../utils/progressTracker';

const isWeb = Platform.OS === 'web';

export default function Progress() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [learningStats, setLearningStats] = useState({
    totalHours: 0,
    coursesStarted: 0,
    coursesCompleted: 0,
    quizzesTaken: 0,
    averageScore: 0,
    streak: 0
  });
  
  const [categoryProgress, setCategoryProgress] = useState([
    { name: 'Programming', completed: 45, total: 150, icon: 'laptop-code' },
    { name: 'Design', completed: 30, total: 120, icon: 'palette' },
    { name: 'Mathematics', completed: 25, total: 90, icon: 'square-root-alt' },
    { name: 'Languages', completed: 20, total: 85, icon: 'language' },
    { name: 'Science', completed: 35, total: 95, icon: 'microscope' },
    { name: 'Music', completed: 15, total: 70, icon: 'music' }
  ]);

  const [pathProgress, setPathProgress] = useState([
    {
      title: 'Full-Stack Development',
      progress: 65,
      completedModules: 8,
      totalModules: 12,
      estimatedCompletion: '2 months'
    },
    {
      title: 'Data Science',
      progress: 40,
      completedModules: 6,
      totalModules: 15,
      estimatedCompletion: '4 months'
    }
  ]);

  const [certificationProgress, setCertificationProgress] = useState([
    {
      title: 'Full Stack Developer',
      provider: 'Tech Academy',
      progress: 70,
      requiredTasks: 10,
      completedTasks: 7,
      estimatedCompletion: '1 month'
    },
    {
      title: 'Data Science Specialist',
      provider: 'Data Institute',
      progress: 45,
      requiredTasks: 12,
      completedTasks: 5,
      estimatedCompletion: '3 months'
    }
  ]);

  const [workshopHistory, setWorkshopHistory] = useState([
    {
      title: 'Building AI Applications',
      date: '2024-03-15',
      completed: true,
      certificateEarned: true
    },
    {
      title: 'Mastering React Native',
      date: '2024-03-20',
      completed: false,
      registered: true
    }
  ]);

  const [quizPerformance, setQuizPerformance] = useState([
    { category: 'Programming', averageScore: 88, totalQuizzes: 15, bestScore: 100 },
    { category: 'Design', averageScore: 92, totalQuizzes: 8, bestScore: 95 },
    { category: 'Mathematics', averageScore: 85, totalQuizzes: 12, bestScore: 98 }
  ]);

  const [achievements, setAchievements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      await ProgressTracker.updateStreak();
      const stats = await ProgressTracker.getLearningStats();
      const achievementsData = await ProgressTracker.getAchievements();
      const activities = await ProgressTracker.getRecentActivities();

      setLearningStats(stats);
      setAchievements(achievementsData);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

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
          {/* Overall Stats */}
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

          {/* Category Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Progress</Text>
            {categoryProgress.map((category, index) => (
              <View key={index} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <FontAwesome5 name={category.icon} size={20} color={Colors.PRIMARY} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${(category.completed / category.total) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {category.completed} of {category.total} courses completed
                </Text>
              </View>
            ))}
          </View>

          {/* Learning Paths */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Paths</Text>
            {pathProgress.map((path, index) => (
              <View key={index} style={styles.pathCard}>
                <Text style={styles.pathTitle}>{path.title}</Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[styles.progressBar, { width: `${path.progress}%` }]} 
                  />
                </View>
                <View style={styles.pathStats}>
                  <Text style={styles.pathProgress}>{path.progress}% Complete</Text>
                  <Text style={styles.moduleCount}>
                    {path.completedModules}/{path.totalModules} Modules
                  </Text>
                  <Text style={styles.estimatedTime}>
                    Est. completion: {path.estimatedCompletion}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Certifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certification Progress</Text>
            {certificationProgress.map((cert, index) => (
              <View key={index} style={styles.certCard}>
                <View style={styles.certHeader}>
                  <Text style={styles.certTitle}>{cert.title}</Text>
                  <Text style={styles.certProvider}>{cert.provider}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[styles.progressBar, { width: `${cert.progress}%` }]} 
                  />
                </View>
                <View style={styles.certStats}>
                  <Text style={styles.taskProgress}>
                    {cert.completedTasks}/{cert.requiredTasks} Tasks Complete
                  </Text>
                  <Text style={styles.estimatedTime}>
                    Est. completion: {cert.estimatedCompletion}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Workshop History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workshop Participation</Text>
            {workshopHistory.map((workshop, index) => (
              <View key={index} style={styles.workshopCard}>
                <View style={styles.workshopHeader}>
                  <MaterialIcons 
                    name={workshop.completed ? "check-circle" : "schedule"} 
                    size={24} 
                    color={workshop.completed ? Colors.PRIMARY : "#FFD700"} 
                  />
                  <Text style={styles.workshopTitle}>{workshop.title}</Text>
                </View>
                <Text style={styles.workshopDate}>Date: {workshop.date}</Text>
                <View style={styles.workshopStatus}>
                  {workshop.completed && (
                    <View style={styles.statusTag}>
                      <Text style={styles.statusText}>Completed</Text>
                    </View>
                  )}
                  {workshop.certificateEarned && (
                    <View style={[styles.statusTag, styles.certTag]}>
                      <Text style={styles.statusText}>Certificate Earned</Text>
                    </View>
                  )}
                  {workshop.registered && !workshop.completed && (
                    <View style={[styles.statusTag, styles.registeredTag]}>
                      <Text style={styles.statusText}>Registered</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Quiz Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quiz Performance</Text>
            {quizPerformance.map((quiz, index) => (
              <View key={index} style={styles.quizCard}>
                <Text style={styles.quizCategory}>{quiz.category}</Text>
                <View style={styles.quizStats}>
                  <View style={styles.quizStat}>
                    <Text style={styles.statLabel}>Average Score</Text>
                    <Text style={styles.statValue}>{quiz.averageScore}%</Text>
                  </View>
                  <View style={styles.quizStat}>
                    <Text style={styles.statLabel}>Best Score</Text>
                    <Text style={styles.statValue}>{quiz.bestScore}%</Text>
                  </View>
                  <View style={styles.quizStat}>
                    <Text style={styles.statLabel}>Total Quizzes</Text>
                    <Text style={styles.statValue}>{quiz.totalQuizzes}</Text>
                  </View>
                </View>
              </View>
            ))}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
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
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 4,
  },
  pathCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pathTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  pathStats: {
    marginTop: 8,
  },
  pathProgress: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
  moduleCount: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  certCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  certHeader: {
    marginBottom: 12,
  },
  certTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  certProvider: {
    fontSize: 14,
    color: Colors.PRIMARY,
    marginTop: 4,
  },
  certStats: {
    marginTop: 8,
  },
  taskProgress: {
    fontSize: 14,
    color: '#f0f0f0',
  },
  workshopCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workshopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workshopTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  workshopDate: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 8,
  },
  workshopStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusTag: {
    backgroundColor: 'rgba(0, 255, 149, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  certTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#FFD700',
  },
  registeredTag: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderColor: '#007AFF',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  quizCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  quizCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizStat: {
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
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginTop: 4,
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