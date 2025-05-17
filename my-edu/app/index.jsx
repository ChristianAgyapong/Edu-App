import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Platform, Dimensions, Easing } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function Landing() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const iconAnim1 = useRef(new Animated.Value(0)).current;
  const iconAnim2 = useRef(new Animated.Value(0)).current;
  const iconAnim3 = useRef(new Animated.Value(0)).current;
  const box1Anim = useRef(new Animated.Value(0)).current;
  const box2Anim = useRef(new Animated.Value(0)).current;
  const box3Anim = useRef(new Animated.Value(0)).current;
  const box4Anim = useRef(new Animated.Value(0)).current;

  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: "laptop-code",
      title: "Interactive Learning",
      description: "Engage with interactive lessons and real-time coding exercises"
    },
    {
      icon: "users",
      title: "Community Support",
      description: "Join a community of learners and expert mentors"
    },
    {
      icon: "certificate",
      title: "Certified Courses",
      description: "Earn recognized certificates upon course completion"
    }
  ];

  const courses = [
    {
      title: "Web Development",
      icon: "code",
      students: "10K+",
      rating: 4.8,
      image: { uri: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg?w=740&t=st=1709494437~exp=1709495037~hmac=df5f8e4b3c2f6a380c89f51e4729b7fb2d9f4fa5a356c3cb5b0daa6d2fe13da8' }
    },
    {
      title: "Mobile Development",
      icon: "mobile-alt",
      students: "8K+",
      rating: 4.9,
      image: { uri: 'https://img.freepik.com/free-vector/app-development-illustration_52683-47931.jpg?w=740&t=st=1709494477~exp=1709495077~hmac=a61643aa6b3f5e9d3d8e9c24a980190a9f5b72e90d2de43c4a502eae8c126e4c' }
    },
    {
      title: "UI/UX Design",
      icon: "paint-brush",
      students: "12K+",
      rating: 4.7,
      image: { uri: 'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg?w=740&t=st=1709494504~exp=1709495104~hmac=8ed4326376e0a1b775a4893f8f6734983d34c2f7c0681a7e06d3e0e1b1a7bec9' }
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Web Development Student",
      image: { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
      text: "This platform transformed my learning journey. The interactive courses and supportive community helped me land my dream job!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "UI/UX Designer",
      image: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
      text: "The practical projects and expert feedback helped me build a strong portfolio. Highly recommended for aspiring designers!",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Mobile Developer",
      image: { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
      text: "The mobile development track is exceptional. Real-world projects and code reviews helped me grow rapidly.",
      rating: 5
    }
  ];

  const achievements = [
    {
      icon: "school",
      number: "50K+",
      label: "Graduates"
    },
    {
      icon: "trending-up",
      number: "89%",
      label: "Success Rate"
    },
    {
      icon: "work",
      number: "75%",
      label: "Job Placement"
    },
    {
      icon: "groups",
      number: "100K+",
      label: "Community"
    }
  ];

  const floatingBoxes = [
    { 
      icon: "wave-pulse",
      label: "Welcome",
      color: "#FF6B6B",
      delay: 0,
      anim: box1Anim,
      position: { top: '10%', left: '5%' }
    },
    { 
      icon: "arrow-right",
      label: "to",
      color: "#4ECDC4",
      delay: 200,
      anim: box2Anim,
      position: { top: '15%', right: '5%' }
    },
    { 
      icon: "star",
      label: "Chrixtech",
      color: "#45B7D1",
      delay: 400,
      anim: box3Anim,
      position: { bottom: '15%', left: '5%' }
    },
    { 
      icon: "apps",
      label: "App",
      color: "#96C93D",
      delay: 600,
      anim: box4Anim,
      position: { bottom: '10%', right: '5%' }
    }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.stagger(200, [
        Animated.spring(iconAnim1, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(iconAnim2, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(iconAnim3, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    floatingBoxes.forEach(box => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(box.anim, {
            toValue: 1,
            duration: 2000,
            delay: box.delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
          Animated.timing(box.anim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          })
        ])
      ).start();
    });

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroImageWrapper}>
          <Animated.View style={[
            styles.heroImageContainer,
            {
              transform: [
                { translateY: bounce },
                { scale: scaleAnim },
              ],
              opacity: fadeAnim
            }
          ]}>
            {/* Floating Boxes */}
            {floatingBoxes.map((box, index) => (
              <Animated.View
                key={box.label}
                style={[
                  styles.floatingBox,
                  {
                    backgroundColor: box.color,
                    ...box.position,
                    transform: [
                      {
                        translateY: box.anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -20]
                        })
                      },
                      {
                        scale: box.anim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [1, 1.1, 1]
                        })
                      }
                    ]
                  }
                ]}
              >
                <MaterialCommunityIcons name={box.icon} size={24} color="#fff" />
                <Text style={styles.boxLabel}>{box.label}</Text>
              </Animated.View>
            ))}

            <Image
              source={require('../assets/images/tec1.png')}
              style={styles.landingImage}
              resizeMode="contain"
            />

            {/* Decorative Circles */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </Animated.View>
        </View>

        <Animated.View style={[
          styles.heroContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={styles.title}>Transform Your Future with Education</Text>
          <Text style={styles.subtitle}>
            Join thousands of students achieving their academic goals through our innovative learning platform
          </Text>
        </Animated.View>
      </View>

      {/* Mission Section */}
      <View style={styles.missionSection}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.missionText}>
          Empowering learners worldwide with cutting-edge education in technology and design. 
          We believe in making quality education accessible to everyone.
        </Text>
        <View style={styles.missionPoints}>
          {["Quality Education", "Expert Instructors", "Industry Recognition", "Lifetime Access"].map((point, index) => (
            <View key={index} style={styles.missionPoint}>
              <MaterialIcons name="check-circle" size={24} color={Colors.PRIMARY} />
              <Text style={styles.missionPointText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features Section (existing but modified to be non-clickable) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={feature.title} style={styles.featureCard}>
              <FontAwesome5 name={feature.icon} size={32} color={Colors.PRIMARY} />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Courses Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Courses</Text>
        <View style={styles.coursesGrid}>
          {courses.map((course) => (
            <View key={course.title} style={styles.courseCard}>
              <Image 
                source={course.image}
                style={styles.courseImage}
                resizeMode="cover"
              />
              <FontAwesome5 name={course.icon} size={40} color={Colors.PRIMARY} />
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.courseInfo}>
                <Text style={styles.courseStudents}>{course.students} Students</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{course.rating}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Our Impact</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View key={achievement.label} style={styles.achievementCard}>
              <MaterialIcons name={achievement.icon} size={40} color={Colors.PRIMARY} />
              <Text style={styles.achievementNumber}>{achievement.number}</Text>
              <Text style={styles.achievementLabel}>{achievement.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Success Stories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.testimonialContainer}
        >
          {testimonials.map((testimonial) => (
            <View key={testimonial.id} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <Image 
                  source={testimonial.image} 
                  style={styles.testimonialImage}
                />
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                </View>
              </View>
              <Text style={styles.testimonialText}>{testimonial.text}</Text>
              <View style={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#FFD700" />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Learning Process Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.processSteps}>
          {[
            { icon: 'account-circle', title: 'Create Account', desc: 'Sign up and set your learning goals' },
            { icon: 'library-books', title: 'Choose Courses', desc: 'Select from our wide range of courses' },
            { icon: 'laptop', title: 'Learn & Practice', desc: 'Access content and complete exercises' },
            { icon: 'emoji-events', title: 'Get Certified', desc: 'Earn certificates and showcase skills' }
          ].map((step, index) => (
            <View key={step.title} style={styles.processStep}>
              <View style={styles.processIcon}>
                <MaterialIcons name={step.icon} size={32} color={Colors.PRIMARY} />
                <Text style={styles.processNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.processTitle}>{step.title}</Text>
              <Text style={styles.processDescription}>{step.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Final CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Start Your Learning Journey Today</Text>
        <Text style={styles.ctaSubtitle}>Join thousands of successful graduates</Text>
        <View style={styles.ctaButtonContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
            <Text style={styles.ctaButtonText}>Begin Free Trial</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondaryButton} onPress={handleLoginPress}>
            <Text style={styles.ctaSecondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Credit Line */}
      <View style={styles.creditSection}>
        <Text style={styles.creditText}>This tool is powered by Christian Agyapong</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  hero: {
    flexDirection: 'column',
    padding: Platform.OS === 'web' ? 40 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Platform.OS === 'web' ? 600 : 'auto',
  },
  heroImageWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 600,
    aspectRatio: 1.2,
    marginBottom: 30,
  },
  heroImageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingBox: {
    position: 'absolute',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 2,
  },
  boxLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
    backgroundColor: Colors.PRIMARY,
  },
  circle1: {
    width: 100,
    height: 100,
    top: '10%',
    left: '5%',
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: '15%',
    right: '5%',
  },
  circle3: {
    width: 80,
    height: 80,
    top: '40%',
    right: '15%',
  },
  landingImage: {
    width: '80%',
    height: '80%',
    borderRadius: 15,
    zIndex: 1,
  },
  heroContent: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    maxWidth: Platform.OS === 'web' ? 800 : '100%',
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4FC3F7',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 18,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 35,
    lineHeight: 26,
  },
  section: {
    padding: 20,
    marginTop: 20,
    maxWidth: Platform.OS === 'web' ? 1200 : '100%',
    marginHorizontal: 'auto',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: Platform.OS === 'web' ? '30%' : '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    opacity: 0.8,
  },
  coursesGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: width * 0.7,
    maxWidth: 300,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  courseImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 10,
  },
  courseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  courseStudents: {
    color: '#f0f0f0',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#f0f0f0',
    marginLeft: 5,
  },
  achievementsSection: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    margin: 20,
    borderRadius: 15,
  },
  achievementsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
    marginTop: 20,
  },
  achievementCard: {
    alignItems: 'center',
    padding: 15,
    width: Platform.OS === 'web' ? '22%' : '100%',
  },
  achievementNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginTop: 10,
  },
  achievementLabel: {
    fontSize: 16,
    color: '#f0f0f0',
    marginTop: 5,
    textAlign: 'center',
  },
  testimonialContainer: {
    marginTop: 20,
  },
  testimonialCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: 300,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  testimonialImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  testimonialRole: {
    fontSize: 14,
    color: Colors.PRIMARY,
    marginTop: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: '#f0f0f0',
    lineHeight: 22,
    marginBottom: 15,
  },
  testimonialRating: {
    flexDirection: 'row',
    marginTop: 10,
  },
  processSteps: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
    marginTop: 20,
  },
  processStep: {
    alignItems: 'center',
    width: Platform.OS === 'web' ? '22%' : '100%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  processIcon: {
    position: 'relative',
    marginBottom: 15,
  },
  processNumber: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: Colors.PRIMARY,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  processTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  processDescription: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaSection: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 15,
    margin: 20,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 18,
    color: '#f0f0f0',
    marginBottom: 30,
    textAlign: 'center',
  },
  ctaButtonContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 10,
  },
  ctaButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  ctaSecondaryButtonText: {
    color: Colors.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
  },
  missionSection: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    margin: 20,
    borderRadius: 15,
    maxWidth: Platform.OS === 'web' ? 1200 : '100%',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  missionText: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    maxWidth: Platform.OS === 'web' ? 800 : '100%',
    marginHorizontal: 'auto',
  },
  missionPoints: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  missionPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    marginHorizontal: 'auto',
  },
  missionPointText: {
    color: '#f0f0f0',
    marginLeft: 10,
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
    maxWidth: 200,
  },
  creditSection: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginTop: 20,
  },
  creditText: {
    color: '#f0f0f0',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
}); 