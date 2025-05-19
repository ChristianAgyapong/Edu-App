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
        }
      ]
    },
    {
      id: 2,
      title: "UI/UX Design Principles",
      category: "Design",
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
        score
      );
      setCurrentQuiz(null);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

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
              {quizzes.map((quiz) => (
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
                    <Text style={styles.questionCount}>
                      {quiz.questions.length} questions
                    </Text>
                  </View>
                  <MaterialIcons 
                    name="arrow-forward-ios" 
                    size={20} 
                    color={Colors.PRIMARY} 
                  />
                </TouchableOpacity>
              ))}
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
  questionCount: {
    fontSize: 12,
    color: Colors.PRIMARY,
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