import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config, { apiRequest, clearAuth } from './config';
import BottomNav from './components/BottomNav';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoadingProfile(true);
      
      // Get phone number from storage for development
      const phoneNumber = await AsyncStorage.getItem('userPhone');
      
      const response = await apiRequest(config.USER_PROFILE_API, {
        method: 'GET',
        headers: {
          'X-Phone-Number': phoneNumber || '', // For development mode
        }
      });
      
      if (response.success && response.user) {
        setUserData(response.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load your profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdateProfile = async () => {
    // Validate input
    if (!userData.firstName || !userData.lastName) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiRequest(config.USER_PROFILE_API, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      
      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await clearAuth();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleGenderSelect = () => {
    Alert.alert(
      'Select Gender',
      'Choose your gender',
      [
        { 
          text: 'Male', 
          onPress: () => handleInputChange('gender', 'Male') 
        },
        { 
          text: 'Female', 
          onPress: () => handleInputChange('gender', 'Female') 
        },
        { 
          text: 'Other', 
          onPress: () => handleInputChange('gender', 'Other') 
        },
        { 
          text: 'Cancel', 
          style: 'cancel' 
        }
      ]
    );
  };

  const handleDateSelect = () => {
    // In a real app, you would use a date picker
    // For now, we'll use a simple prompt
    Alert.prompt(
      'Enter Date of Birth',
      'Format: YYYY-MM-DD',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Save',
          onPress: (text) => handleInputChange('dateOfBirth', text || '')
        }
      ],
      'plain-text',
      userData.dateOfBirth
    );
  };

  if (isLoadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#4285F4" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={60} color="#ff9e9e" />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What's your first and last name?"
            value={`${userData.firstName} ${userData.lastName}`.trim()}
            onChangeText={(text) => {
              const nameParts = text.split(' ');
              handleInputChange('firstName', nameParts[0] || '');
              handleInputChange('lastName', nameParts.slice(1).join(' ') || '');
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What's your Email address?"
            value={userData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <View style={styles.flagContainer}>
                <Text>🇮🇳</Text>
              </View>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter Phone Number"
              value={userData.phoneNumber.replace(/^\+91/, '')}
              editable={false}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.inputContainer} 
          onPress={handleGenderSelect}
        >
          <View style={styles.selectInput}>
            <Text style={userData.gender ? styles.selectText : styles.placeholderText}>
              {userData.gender || 'Select your gender'}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.inputContainer} 
          onPress={handleDateSelect}
        >
          <View style={styles.selectInput}>
            <Text style={userData.dateOfBirth ? styles.selectText : styles.placeholderText}>
              {userData.dateOfBirth || 'What is your date of birth?'}
            </Text>
            <Ionicons name="calendar-outline" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffcdd2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  flagContainer: {
    marginRight: 5,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#999',
  },
  selectInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  updateButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  updateButtonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});