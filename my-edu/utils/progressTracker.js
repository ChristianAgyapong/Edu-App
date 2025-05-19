import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      const item = localStorage.getItem(key);
      return item ? Promise.resolve(item) : Promise.resolve(null);
    }
    // For native platforms, we'll need AsyncStorage
    // Return null for now until AsyncStorage is properly set up
    return Promise.resolve(null);
  },

  async setItem(key, value) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    // For native platforms, we'll need AsyncStorage
    // No-op for now until AsyncStorage is properly set up
    return Promise.resolve();
  },

  async multiRemove(keys) {
    if (Platform.OS === 'web') {
      keys.forEach(key => localStorage.removeItem(key));
      return Promise.resolve();
    }
    // For native platforms, we'll need AsyncStorage
    // No-op for now until AsyncStorage is properly set up
    return Promise.resolve();
  }
};

const STORAGE_KEYS = {
  LEARNING_STATS: 'learning_stats',
  ACHIEVEMENTS: 'achievements',
  RECENT_ACTIVITIES: 'recent_activities',
  COURSE_PROGRESS: 'course_progress',
  CATEGORY_PROGRESS: 'category_progress',
  PATH_PROGRESS: 'path_progress',
  CERTIFICATION_PROGRESS: 'certification_progress',
  WORKSHOP_HISTORY: 'workshop_history',
  QUIZ_PERFORMANCE: 'quiz_performance',
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

  static async trackCourseProgress(courseId, title, progress, category) {
    try {
      // Update course progress
      const courseProgress = await this.getCourseProgress();
      courseProgress[courseId] = { title, progress };
      await storage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(courseProgress));

      // Update category progress
      if (category) {
        const categoryProgress = await this.getCategoryProgress();
        const categoryIndex = categoryProgress.findIndex(cat => cat.name === category);
        if (categoryIndex !== -1) {
          categoryProgress[categoryIndex].completed += 1;
          await storage.setItem(STORAGE_KEYS.CATEGORY_PROGRESS, JSON.stringify(categoryProgress));
        }
      }

      // Update learning stats
      const stats = await this.getLearningStats();
      if (progress === 100) {
        stats.coursesCompleted += 1;
      } else if (!courseProgress[courseId]) {
        stats.coursesStarted += 1;
      }
      await this.saveLearningStats(stats);

      // Add to recent activities
      await this.addRecentActivity({
        type: 'course_progress',
        title: `Progress in ${title}`,
        detail: `Completed ${progress}% of the course`,
        progress,
        timestamp: new Date().toISOString(),
      });

      return { courseProgress, stats };
    } catch (error) {
      console.error('Error tracking course progress:', error);
    }
  }

  static async trackQuizCompletion(quizId, category, score, details) {
    try {
      // Get existing quiz progress
      const quizProgressStr = await storage.getItem('quizProgress');
      const quizProgress = quizProgressStr ? JSON.parse(quizProgressStr) : {};

      // Update quiz progress
      quizProgress[quizId] = {
        category,
        score,
        completedAt: new Date().toISOString(),
        ...details
      };

      // Save updated progress
      await storage.setItem('quizProgress', JSON.stringify(quizProgress));

      // Update category progress
      await this.updateCategoryProgress(category, score);

      // Update learning stats
      await this.updateLearningStats('quizzes', score);
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
    }
  }

  static async updatePathProgress(pathId, title, completedModules, totalModules) {
    try {
      const pathProgress = await this.getPathProgress();
      const pathIndex = pathProgress.findIndex(p => p.title === title);
      if (pathIndex !== -1) {
        pathProgress[pathIndex].completedModules = completedModules;
        pathProgress[pathIndex].progress = Math.round((completedModules / totalModules) * 100);
        await storage.setItem(STORAGE_KEYS.PATH_PROGRESS, JSON.stringify(pathProgress));

        // Add to recent activities
        await this.addRecentActivity({
          type: 'path_progress',
          title: `Progress in ${title}`,
          detail: `Completed ${completedModules} of ${totalModules} modules`,
          progress: pathProgress[pathIndex].progress,
          timestamp: new Date().toISOString(),
        });
      }
      return pathProgress;
    } catch (error) {
      console.error('Error updating path progress:', error);
    }
  }

  static async updateCertificationProgress(certId, title, completedTasks, requiredTasks) {
    try {
      const certProgress = await this.getCertificationProgress();
      const certIndex = certProgress.findIndex(c => c.title === title);
      if (certIndex !== -1) {
        certProgress[certIndex].completedTasks = completedTasks;
        certProgress[certIndex].progress = Math.round((completedTasks / requiredTasks) * 100);
        await storage.setItem(STORAGE_KEYS.CERTIFICATION_PROGRESS, JSON.stringify(certProgress));

        if (completedTasks === requiredTasks) {
          // Add achievement for completing certification
          await this.addAchievement({
            title: 'Certification Master',
            description: `Completed ${title} certification`,
            icon: 'certificate',
            unlockedDate: new Date().toISOString(),
          });
        }

        // Add to recent activities
        await this.addRecentActivity({
          type: 'certification_progress',
          title: `Certification Progress: ${title}`,
          detail: `Completed ${completedTasks} of ${requiredTasks} tasks`,
          progress: certProgress[certIndex].progress,
          timestamp: new Date().toISOString(),
        });
      }
      return certProgress;
    } catch (error) {
      console.error('Error updating certification progress:', error);
    }
  }

  static async updateWorkshopStatus(workshopId, title, status) {
    try {
      const workshops = await this.getWorkshopHistory();
      const workshopIndex = workshops.findIndex(w => w.title === title);
      if (workshopIndex !== -1) {
        workshops[workshopIndex] = { ...workshops[workshopIndex], ...status };
        await storage.setItem(STORAGE_KEYS.WORKSHOP_HISTORY, JSON.stringify(workshops));

        // Add to recent activities
        let activityDetail = '';
        if (status.completed) {
          activityDetail = 'Completed the workshop';
        } else if (status.registered) {
          activityDetail = 'Registered for the workshop';
        }

        if (activityDetail) {
          await this.addRecentActivity({
            type: 'workshop_update',
            title: `Workshop: ${title}`,
            detail: activityDetail,
            timestamp: new Date().toISOString(),
          });
        }
      }
      return workshops;
    } catch (error) {
      console.error('Error updating workshop status:', error);
    }
  }

  static async updateStreak() {
    try {
      const stats = await this.getLearningStats();
      const lastActive = await storage.getItem('last_active_date');
      const today = new Date().toDateString();

      if (lastActive !== today) {
        if (lastActive === new Date(Date.now() - 86400000).toDateString()) {
          // If last active yesterday, increment streak
          stats.streak += 1;
        } else {
          // Reset streak if not active yesterday
          stats.streak = 1;
        }
        await storage.setItem('last_active_date', today);
        await this.saveLearningStats(stats);
      }
      return stats.streak;
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  static async addAchievement(achievement) {
    try {
      const achievements = await this.getAchievements();
      achievements.push({ id: Date.now(), ...achievement });
      await storage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));

      // Add to recent activities
      await this.addRecentActivity({
        type: 'achievement_earned',
        title: 'New Achievement!',
        detail: `Earned: ${achievement.title}`,
        timestamp: new Date().toISOString(),
      });

      return achievements;
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  }

  static async addRecentActivity(activity) {
    try {
      const activities = await this.getRecentActivities();
      activities.unshift({ id: Date.now(), ...activity });
      // Keep only last 50 activities
      const trimmedActivities = activities.slice(0, 50);
      await storage.setItem(STORAGE_KEYS.RECENT_ACTIVITIES, JSON.stringify(trimmedActivities));
      return trimmedActivities;
    } catch (error) {
      console.error('Error adding recent activity:', error);
    }
  }

  static async updateCategoryProgress(category, score) {
    try {
      const categoryProgressStr = await storage.getItem('categoryProgress');
      const categoryProgress = categoryProgressStr ? JSON.parse(categoryProgressStr) : {};

      if (!categoryProgress[category]) {
        categoryProgress[category] = {
          quizzesTaken: 0,
          totalScore: 0,
          highestScore: 0
        };
      }

      const progress = categoryProgress[category];
      progress.quizzesTaken += 1;
      progress.totalScore += score;
      progress.highestScore = Math.max(progress.highestScore, score);
      progress.averageScore = progress.totalScore / progress.quizzesTaken;

      await storage.setItem('categoryProgress', JSON.stringify(categoryProgress));
    } catch (error) {
      console.error('Error updating category progress:', error);
    }
  }

  static async updateLearningStats(type, value) {
    try {
      const statsStr = await storage.getItem('learningStats');
      const stats = statsStr ? JSON.parse(statsStr) : {
        totalQuizzesTaken: 0,
        averageScore: 0,
        totalScore: 0,
        streakDays: 0,
        lastActivity: null
      };

      if (type === 'quizzes') {
        stats.totalQuizzesTaken += 1;
        stats.totalScore += value;
        stats.averageScore = stats.totalScore / stats.totalQuizzesTaken;
      }

      // Update streak
      const today = new Date().toDateString();
      if (stats.lastActivity !== today) {
        stats.streakDays += 1;
        stats.lastActivity = today;
      }

      await storage.setItem('learningStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating learning stats:', error);
    }
  }

  // Getter methods
  static async getLearningStats() {
    try {
      const statsStr = await storage.getItem('learningStats');
      return statsStr ? JSON.parse(statsStr) : {
        totalQuizzesTaken: 0,
        averageScore: 0,
        totalScore: 0,
        streakDays: 0,
        lastActivity: null
      };
    } catch (error) {
      console.error('Error getting learning stats:', error);
      return null;
    }
  }

  static async getCourseProgress() {
    try {
      const progress = await storage.getItem(STORAGE_KEYS.COURSE_PROGRESS);
      return progress ? JSON.parse(progress) : {};
    } catch (error) {
      console.error('Error getting course progress:', error);
      return null;
    }
  }

  static async getCategoryProgress() {
    try {
      const progressStr = await storage.getItem('categoryProgress');
      return progressStr ? JSON.parse(progressStr) : {};
    } catch (error) {
      console.error('Error getting category progress:', error);
      return {};
    }
  }

  static async getPathProgress() {
    try {
      const progress = await storage.getItem(STORAGE_KEYS.PATH_PROGRESS);
      return progress ? JSON.parse(progress) : [
        {
          title: 'Full-Stack Development',
          progress: 0,
          completedModules: 0,
          totalModules: 12,
          estimatedCompletion: '6 months'
        },
        {
          title: 'Data Science',
          progress: 0,
          completedModules: 0,
          totalModules: 15,
          estimatedCompletion: '8 months'
        }
      ];
    } catch (error) {
      console.error('Error getting path progress:', error);
      return null;
    }
  }

  static async getCertificationProgress() {
    try {
      const progress = await storage.getItem(STORAGE_KEYS.CERTIFICATION_PROGRESS);
      return progress ? JSON.parse(progress) : [
        {
          title: 'Full Stack Developer',
          provider: 'Tech Academy',
          progress: 0,
          requiredTasks: 10,
          completedTasks: 0,
          estimatedCompletion: '3 months'
        },
        {
          title: 'Data Science Specialist',
          provider: 'Data Institute',
          progress: 0,
          requiredTasks: 12,
          completedTasks: 0,
          estimatedCompletion: '4 months'
        }
      ];
    } catch (error) {
      console.error('Error getting certification progress:', error);
      return null;
    }
  }

  static async getWorkshopHistory() {
    try {
      const history = await storage.getItem(STORAGE_KEYS.WORKSHOP_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting workshop history:', error);
      return null;
    }
  }

  static async getQuizPerformance() {
    try {
      const performance = await storage.getItem(STORAGE_KEYS.QUIZ_PERFORMANCE);
      return performance ? JSON.parse(performance) : [
        { category: 'Programming', averageScore: 0, totalQuizzes: 0, bestScore: 0 },
        { category: 'Design', averageScore: 0, totalQuizzes: 0, bestScore: 0 },
        { category: 'Mathematics', averageScore: 0, totalQuizzes: 0, bestScore: 0 }
      ];
    } catch (error) {
      console.error('Error getting quiz performance:', error);
      return null;
    }
  }

  static async getAchievements() {
    try {
      const achievements = await storage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return achievements ? JSON.parse(achievements) : [];
    } catch (error) {
      console.error('Error getting achievements:', error);
      return null;
    }
  }

  static async getRecentActivities() {
    try {
      const activitiesStr = await storage.getItem('recentActivities');
      return activitiesStr ? JSON.parse(activitiesStr) : [];
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return [];
    }
  }

  // Helper method to save learning stats
  static async saveLearningStats(stats) {
    try {
      await storage.setItem(STORAGE_KEYS.LEARNING_STATS, JSON.stringify(stats));
      return stats;
    } catch (error) {
      console.error('Error saving learning stats:', error);
    }
  }

  static async getQuizProgress() {
    try {
      const progressStr = await storage.getItem('quizProgress');
      return progressStr ? JSON.parse(progressStr) : {};
    } catch (error) {
      console.error('Error getting quiz progress:', error);
      return {};
    }
  }

  static async resetProgress() {
    try {
      await storage.multiRemove([
        'quizProgress',
        'categoryProgress',
        'learningStats',
        'recentActivities'
      ]);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }
}

export default ProgressTracker; 