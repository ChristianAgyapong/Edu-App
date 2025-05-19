import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import * as Haptics from 'expo-haptics';
import ProgressTracker from '../../utils/progressTracker';

const isWeb = Platform.OS === 'web';

export default function Quiz() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      category: "Programming",
      description: "Test your knowledge of JavaScript basics",
      difficulty: "Beginner",
      estimatedTime: "10 mins",
      questions: [
        {
          id: 1,
          question: "What is JavaScript?",
          options: [
            "A programming language",
            "A markup language",
            "A database",
            "An operating system"
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "Which keyword is used to declare variables in JavaScript?",
          options: [
            "var",
            "let",
            "const",
            "All of the above"
          ],
          correctAnswer: 3
        },
        {
          id: 3,
          question: "What is the correct way to write a JavaScript array?",
          options: [
            "var colors = (1:'red', 2:'green', 3:'blue')",
            "var colors = 'red', 'green', 'blue'",
            "var colors = ['red', 'green', 'blue']",
            "var colors = {red, green, blue}"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 2,
      title: "UI/UX Design Principles",
      category: "Design",
      description: "Test your understanding of UI/UX design fundamentals",
      difficulty: "Intermediate",
      estimatedTime: "15 mins",
      questions: [
        {
          id: 1,
          question: "What is the primary goal of UX design?",
          options: [
            "Making things look pretty",
            "Enhancing user satisfaction",
            "Adding animations",
            "Using trendy colors"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Which principle suggests that related elements should be grouped together?",
          options: [
            "Contrast",
            "Repetition",
            "Proximity",
            "Alignment"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "What is the purpose of a wireframe?",
          options: [
            "To make the final design look beautiful",
            "To plan the basic structure and layout",
            "To add colors and images",
            "To test the website"
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 3,
      title: "Python Programming",
      category: "Programming",
      description: "Test your Python programming skills",
      difficulty: "Beginner",
      estimatedTime: "12 mins",
      questions: [
        {
          id: 1,
          question: "What is Python?",
          options: [
            "A snake species",
            "A high-level programming language",
            "A database system",
            "A web browser"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "How do you create a list in Python?",
          options: [
            "list = (1, 2, 3)",
            "list = {1, 2, 3}",
            "list = [1, 2, 3]",
            "list = <1, 2, 3>"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "Which of these is a correct way to comment in Python?",
          options: [
            "// This is a comment",
            "/* This is a comment */",
            "# This is a comment",
            "<!-- This is a comment -->"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 4,
      title: "Web Development Basics",
      category: "Programming",
      description: "Test your knowledge of web development fundamentals",
      difficulty: "Beginner",
      estimatedTime: "15 mins",
      questions: [
        {
          id: 1,
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "Which CSS property is used to change the text color?",
          options: [
            "text-color",
            "font-color",
            "color",
            "text-style"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "What is the correct HTML for creating a hyperlink?",
          options: [
            "<link>Google</link>",
            "<a url='google.com'>Google</a>",
            "<a href='google.com'>Google</a>",
            "<hyperlink>Google</hyperlink>"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 5,
      title: "Mobile App Design",
      category: "Design",
      description: "Test your mobile app design knowledge",
      difficulty: "Advanced",
      estimatedTime: "20 mins",
      questions: [
        {
          id: 1,
          question: "What is the recommended minimum touch target size for mobile interfaces?",
          options: [
            "24x24 pixels",
            "44x44 pixels",
            "16x16 pixels",
            "32x32 pixels"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Which gesture is most commonly used for refreshing content on mobile?",
          options: [
            "Double tap",
            "Long press",
            "Pull to refresh",
            "Pinch to zoom"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "What is the purpose of a bottom navigation bar in mobile apps?",
          options: [
            "To look pretty",
            "To fill empty space",
            "To provide quick access to key features",
            "To show ads"
          ],
          correctAnswer: 2
        }
      ]
    }
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleQuizStart = async (quiz) => {
    if (!isWeb) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('Haptics not available');
      }
    }
    setCurrentQuiz(quiz);
  };

  const handleQuizSubmit = async (quiz, score) => {
    try {
      await ProgressTracker.trackQuizCompletion(
        quiz.id,
        quiz.category,
        score,
        {
          title: quiz.title,
          difficulty: quiz.difficulty,
          totalQuestions: quiz.questions.length,
          timestamp: new Date().toISOString()
        }
      );

      await ProgressTracker.addRecentActivity({
        type: 'quiz_completed',
        title: `Completed ${quiz.title}`,
        detail: `Scored ${score}% on ${quiz.difficulty} level quiz`,
        timestamp: new Date().toISOString(),
        category: quiz.category
      });

      setCurrentQuiz(null);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const renderQuizCard = (quiz) => (
    <TouchableOpacity
      key={quiz.id}
      style={styles.quizCard}
      onPress={() => handleQuizStart(quiz)}
    >
      <View style={styles.quizIcon}>
        <MaterialIcons 
          name={quiz.category === "Programming" ? "code" : "brush"} 
          size={24} 
          color={Colors.PRIMARY} 
        />
      </View>
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <Text style={styles.quizCategory}>{quiz.category}</Text>
        <View style={styles.quizMetaInfo}>
          <View style={styles.metaItem}>
            <MaterialIcons name="help" size={16} color={Colors.PRIMARY} />
            <Text style={styles.metaText}>{quiz.questions.length} questions</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="timer" size={16} color={Colors.PRIMARY} />
            <Text style={styles.metaText}>{quiz.estimatedTime}</Text>
          </View>
          <View style={[styles.difficultyTag, styles[quiz.difficulty.toLowerCase()]]}>
            <Text style={styles.difficultyText}>{quiz.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.quizDescription}>{quiz.description}</Text>
      </View>
      <MaterialIcons 
        name="arrow-forward-ios" 
        size={20} 
        color={Colors.PRIMARY} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice Quizzes</Text>
      </View>

      <ScrollView style={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {!currentQuiz ? (
            <View style={styles.quizList}>
              {quizzes.map(renderQuizCard)}
            </View>
          ) : (
            <QuizContent 
              quiz={currentQuiz} 
              onComplete={handleQuizSubmit}
              onBack={() => setCurrentQuiz(null)}
            />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function QuizContent({ quiz, onComplete, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    setShowResults(true);
    await onComplete(quiz, score);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <View style={styles.resultsContainer}>
        <MaterialIcons 
          name={score >= 70 ? "check-circle" : "error"} 
          size={64} 
          color={score >= 70 ? "#4CAF50" : "#F44336"} 
        />
        <Text style={styles.scoreText}>Your Score: {score}%</Text>
        <TouchableOpacity 
          style={styles.backToQuizzes}
          onPress={onBack}
        >
          <Text style={styles.backToQuizzesText}>Back to Quizzes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <View style={styles.quizContainer}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </Text>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswers[question.id] === index && styles.optionSelected
            ]}
            onPress={() => handleAnswer(question.id, index)}
          >
            <Text style={[
              styles.optionText,
              selectedAnswers[question.id] === index && styles.optionTextSelected
            ]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navigationButtons}>
        {currentQuestion > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentQuestion(prev => prev - 1)}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentQuestion < quiz.questions.length - 1 ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentQuestion(prev => prev + 1)}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        )}
      </View>
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
    alignItems: 'center',
    padding: 20,
    paddingTop: isWeb ? 40 : 20,
    backgroundColor: '#232838',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  quizList: {
    padding: 20,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  quizIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  quizCategory: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.8,
    marginBottom: 4,
  },
  quizMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: '#f0f0f0',
    fontSize: 14,
    marginLeft: 4,
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  beginner: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  intermediate: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  advanced: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quizDescription: {
    color: '#f0f0f0',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  quizContainer: {
    padding: 20,
  },
  questionHeader: {
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 14,
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  optionTextSelected: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 24,
  },
  backToQuizzes: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToQuizzesText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 