import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

const isWeb = Platform.OS === 'web';

export default function Profile() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    router.replace('/');
  };

  const menuItems = [
    {
      id: 1,
      title: 'Edit Profile',
      icon: <MaterialIcons name="edit" size={24} color={Colors.PRIMARY} />
    },
    {
      id: 2,
      title: 'Notifications',
      icon: <MaterialIcons name="notifications" size={24} color={Colors.PRIMARY} />
    },
    {
      id: 3,
      title: 'Payment Methods',
      icon: <MaterialIcons name="payment" size={24} color={Colors.PRIMARY} />
    },
    {
      id: 4,
      title: 'Help & Support',
      icon: <MaterialIcons name="help" size={24} color={Colors.PRIMARY} />
    },
    {
      id: 5,
      title: 'About Us',
      icon: <MaterialIcons name="info" size={24} color={Colors.PRIMARY} />
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <MaterialIcons name="account-circle" size={80} color="#fff" />
            </View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map(item => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  {item.icon}
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <MaterialIcons name="chevron-right" size={24} color="#fff" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#ff4757" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#f0f0f0',
    opacity: 0.8,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  logoutText: {
    color: '#ff4757',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 