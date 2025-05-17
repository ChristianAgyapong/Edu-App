import { View, Text, ScrollView, StyleSheet, Platform, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const isWeb = Platform.OS === 'web';

export default function Progress() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const achievements = [
    {
      id: 1,
      title: 'Fast Learner',
      description: 'Completed 3 lessons in one day',
      icon: <MaterialIcons name="speed" size={24} color={Colors.PRIMARY} />
    },
    {
      id: 2,
      title: 'Perfect Score',
      description: 'Got 100% in a quiz',
      icon: <MaterialIcons name="stars" size={24} color={Colors.PRIMARY} />
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Overall Progress */}
          <View style={styles.overallProgress}>
            <Text style={styles.sectionTitle}>Overall Progress</Text>
            <View style={styles.progressCircle}>
              <Text style={styles.progressNumber}>85%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>

          {/* Weekly Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialIcons name="timer" size={24} color={Colors.PRIMARY} />
                <Text style={styles.statNumber}>12h</Text>
                <Text style={styles.statLabel}>Study Time</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="school" size={24} color={Colors.PRIMARY} />
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Lessons</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="emoji-events" size={24} color={Colors.PRIMARY} />
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Quizzes</Text>
              </View>
            </View>
          </View>

          {/* Recent Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            {achievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  {achievement.icon}
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
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
  overallProgress: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 4,
    borderColor: Colors.PRIMARY,
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  progressLabel: {
    fontSize: 16,
    color: '#f0f0f0',
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
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
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '30%',
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
    opacity: 0.8,
  },
}); 