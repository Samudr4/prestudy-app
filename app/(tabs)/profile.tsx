import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from "react-native";
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../config";

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      const userPhone = await AsyncStorage.getItem('userPhone');
      
      if (!token) {
        // If no token, redirect to login
        router.replace('/login');
        return;
      }

      // In a real implementation, make API call to get user profile
      // const response = await fetch(`${config.USER_PROFILE_API}?phone=${encodeURIComponent(userPhone || '')}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setUserData(data.user);
      // }
      
      // Using dummy data for development/demo
      const dummyUser = {
        _id: '12345',
        phoneNumber: userPhone || '+919876543210',
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex.smith@example.com',
        gender: 'male',
        dateOfBirth: '1990-01-15',
        enrolledCourses: 5,
        completedCourses: 2,
        totalQuizzesTaken: 48,
        averageScore: 72,
      };
      
      setUserData(dummyUser);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Log Out",
            onPress: async () => {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userPhone');
              router.replace('/login');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const renderMenuItem = (icon, title, onPress, color = "#4169E1") => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
          {icon}
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Feather name="edit-2" size={24} color="#4169E1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{userData?.firstName} {userData?.lastName}</Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
          <Text style={styles.userPhone}>{userData?.phoneNumber}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData?.enrolledCourses || 0}</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData?.completedCourses || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData?.totalQuizzesTaken || 0}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData?.averageScore || 0}%</Text>
            <Text style={styles.statLabel}>Avg. Score</Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Account Settings</Text>
        </View>

        {renderMenuItem(
          <Feather name="user" size={20} color="#4169E1" />,
          "Edit Profile",
          handleEditProfile
        )}
        
        {renderMenuItem(
          <Ionicons name="notifications-outline" size={20} color="#4169E1" />,
          "Notifications",
          () => router.push('/notifications')
        )}
        
        {renderMenuItem(
          <MaterialIcons name="history" size={20} color="#4169E1" />,
          "Purchase History",
          () => router.push('/purchase_history')
        )}
        
        {renderMenuItem(
          <Feather name="help-circle" size={20} color="#4169E1" />,
          "Help & Support",
          () => router.push('/support')
        )}
        
        {renderMenuItem(
          <Ionicons name="settings-outline" size={20} color="#4169E1" />,
          "Settings",
          () => router.push('/settings')
        )}
        
        {renderMenuItem(
          <MaterialIcons name="logout" size={20} color="#FF3B30" />,
          "Logout",
          handleLogout,
          "#FF3B30"
        )}
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
}); 