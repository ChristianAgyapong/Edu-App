import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  LEARNING_STATS: 'learning_stats',
  ACHIEVEMENTS: 'achievements',
  RECENT_ACTIVITIES: 'recent_activities',
  COURSE_PROGRESS: 'course_progress',
};

class ProgressTracker {
  static async updateLearningTime(minutes) {
    try {
      const stats = await this.getLearningStats();
      stats.totalHours = parseFloat(((stats.totalHours * 60 + minutes) / 60).toFixed(1));
      await this.saveLearningStats(stats);
      return stats;
    } catch (error) {
      console.error('Error updating learning time:', error);
    }
  }

  static async trackCourseProgress(courseId, title, progress) {
    try {
      const courseProgress = await this.getCourseProgress();
      courseProgress[courseId] = { title, progress };
      await AsyncStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(courseProgress));

      // Add to recent activities
      await this.addActivity({
        type: 'course_progress',
        title,
        detail: `Progress: ${progress}%`,
        timestamp: new Date().toISOString(),
        progress
      });

      // Check for achievements
      await this.checkCourseAchievements(courseProgress);
    } catch (error) {
      console.error('Error tracking course progress:', error);
    }
  }

  static async trackQuizCompletion(quizId, title, score) {
    try {
      const stats = await this.getLearningStats();
      stats.quizzesTaken += 1;
      stats.averageScore = Math.round(
        (stats.averageScore * (stats.quizzesTaken - 1) + score) / stats.quizzesTaken
      );
      await this.saveLearningStats(stats);

      // Add to recent activities
      await this.addActivity({
        type: 'quiz_completed',
        title,
        detail: `Scored ${score}%`,
        timestamp: new Date().toISOString(),
        score
      });

      // Check for achievements
      if (score === 100) {
        await this.unlockAchievement('Perfect Score', 'Got 100% in a quiz');
      }
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
    }
  }

  static async trackCertificateEarned(title) {
    try {
      const stats = await this.getLearningStats();
      stats.certificatesEarned = (stats.certificatesEarned || 0) + 1;
      await this.saveLearningStats(stats);

      // Add to recent activities
      await this.addActivity({
        type: 'certificate_earned',
        title,
        detail: 'Certificate earned',
        timestamp: new Date().toISOString()
      });

      // Check for achievements
      if (stats.certificatesEarned >= 5) {
        await this.unlockAchievement(
          'Certificate Master',
          'Earned 5 certificates'
        );
      }
    } catch (error) {
      console.error('Error tracking certificate:', error);
    }
  }

  static async updateStreak() {
    try {
      const stats = await this.getLearningStats();
      const lastActive = new Date(stats.lastActiveDate || 0);
      const today = new Date();
      
      if (lastActive.toDateString() === today.toDateString()) {
        return stats.streak;
      }

      const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        stats.streak += 1;
      } else if (dayDiff > 1) {
        stats.streak = 1;
      }

      stats.lastActiveDate = today.toISOString();
      await this.saveLearningStats(stats);

      // Check for streak achievements
      if (stats.streak >= 7) {
        await this.unlockAchievement(
          'Week Warrior',
          'Maintained a 7-day learning streak'
        );
      }

      return stats.streak;
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  static async unlockAchievement(title, description) {
    try {
      const achievements = await this.getAchievements();
      const existingAchievement = achievements.find(a => a.title === title);

      if (!existingAchievement) {
        achievements.unshift({
          id: Date.now(),
          title,
          description,
          unlockedDate: new Date().toISOString()
        });
        await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  }

  static async addActivity(activity) {
    try {
      const activities = await this.getRecentActivities();
      activities.unshift({
        id: Date.now(),
        ...activity
      });
      
      // Keep only last 20 activities
      const recentActivities = activities.slice(0, 20);
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITIES, JSON.stringify(recentActivities));
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  }

  // Helper methods to get/save data
  static async getLearningStats() {
    try {
      const stats = await AsyncStorage.getItem(STORAGE_KEYS.LEARNING_STATS);
      return stats ? JSON.parse(stats) : {
        totalHours: 0,
        coursesStarted: 0,
        coursesCompleted: 0,
        quizzesTaken: 0,
        averageScore: 0,
        certificatesEarned: 0,
        streak: 0,
        lastActiveDate: null
      };
    } catch (error) {
      console.error('Error getting learning stats:', error);
      return null;
    }
  }

  static async getAchievements() {
    try {
      const achievements = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return achievements ? JSON.parse(achievements) : [];
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  static async getRecentActivities() {
    try {
      const activities = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITIES);
      return activities ? JSON.parse(activities) : [];
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return [];
    }
  }

  static async getCourseProgress() {
    try {
      const progress = await AsyncStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS);
      return progress ? JSON.parse(progress) : {};
    } catch (error) {
      console.error('Error getting course progress:', error);
      return {};
    }
  }

  static async saveLearningStats(stats) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LEARNING_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving learning stats:', error);
    }
  }

  static async resetProgress() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.LEARNING_STATS,
        STORAGE_KEYS.ACHIEVEMENTS,
        STORAGE_KEYS.RECENT_ACTIVITIES,
        STORAGE_KEYS.COURSE_PROGRESS
      ]);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }
}

export default ProgressTracker; 