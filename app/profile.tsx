import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, Modal, FlatList, Platform } from "react-native";
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from "./config";

// Gender options
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "not_specified" }
];

interface UserProfile {
  _id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
}

// Add interface for gender option
interface GenderOption {
  label: string;
  value: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

      // Make the API call to get user profile
      const response = await fetch(`${config.USER_PROFILE_API}?phone=${encodeURIComponent(userPhone || '')}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
        setFirstName(data.user.firstName || '');
        setLastName(data.user.lastName || '');
        setEmail(data.user.email || '');
        setPhoneNumber(data.user.phoneNumber || '');
        setGender(data.user.gender || '');
        setDateOfBirth(data.user.dateOfBirth || '');
      } else {
        throw new Error(data.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Fallback to dummy data for development/demo
      const dummyUser: UserProfile = {
        _id: '12345',
        phoneNumber: '+919876543210',
        firstName: 'user',
        lastName: 'Firstname',
        email: 'usermail',
        gender: '',
        dateOfBirth: ''
      };
      
      setUserData(dummyUser);
      setFirstName(dummyUser.firstName);
      setLastName(dummyUser.lastName);
      setEmail(dummyUser.email);
      setPhoneNumber(dummyUser.phoneNumber);
      setGender(dummyUser.gender);
      setDateOfBirth(dummyUser.dateOfBirth);
      
      Alert.alert('Notice', 'Using demo data for profile. In production, this would fetch from the API.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      const userPhone = await AsyncStorage.getItem('userPhone');
      
      if (!token) {
        router.replace('/login');
        return;
      }

      // Make the API call to update user profile
      const response = await fetch(`${config.USER_PROFILE_API}?phone=${encodeURIComponent(userPhone || '')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: userPhone,
          gender,
          dateOfBirth
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Profile updated successfully');
        setUserData(data.user);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // For demo/development fallback
      Alert.alert('Notice', 'Profile update simulated. In production, this would update the backend.');
      setTimeout(() => {
        setUserData({
          ...userData!,
          firstName,
          lastName,
          email,
          gender,
          dateOfBirth
        });
      }, 1000);
    } finally {
      setUpdating(false);
    }
  };

  const renderGenderOption = ({ item }: { item: GenderOption }) => (
    <TouchableOpacity 
      style={styles.genderOption}
      onPress={() => {
        setGender(item.value);
        setShowGenderModal(false);
      }}
    >
      <Text style={[
        styles.genderOptionText, 
        gender === item.value && styles.selectedGenderText
      ]}>
        {item.label}
      </Text>
      {gender === item.value && (
        <Feather name="check" size={20} color="#4169E1" />
      )}
    </TouchableOpacity>
  );

  // Format date string as DD/MM/YYYY
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return as is if invalid date
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // Handle date change from date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate.toISOString().split('T')[0]);
    }
  };

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit-2" size={24} color="#4169E1" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Feather name="user" size={40} color="#e74c3c" />
          </View>
        </View>

        <Text style={styles.name}>{userData?.firstName} {userData?.lastName}</Text>
        <Text style={styles.email}>{userData?.email}</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="What's your first name?"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={styles.input}
            placeholder="And your last name?"
            value={lastName}
            onChangeText={setLastName}
          />

          <View style={styles.phoneInputContainer}>
            <View style={styles.countryFlag}>
              <Text style={styles.flagText}>🇮🇳</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={false} // Phone number is typically not editable after verification
            />
          </View>

          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={[styles.dropdownText, gender ? { color: '#000' } : {}]}>
              {gender ? GENDER_OPTIONS.find(option => option.value === gender)?.label : "Select your gender"}
            </Text>
            <Feather name="chevron-down" size={20} color="#999" style={styles.dropdownIcon} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dropdownText, dateOfBirth ? { color: '#000' } : {}]}>
              {dateOfBirth ? formatDate(dateOfBirth) : "What is your date of birth?"}
            </Text>
            <Feather name="calendar" size={20} color="#999" style={styles.dropdownIcon} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.updateButton, updating && styles.disabledButton]}
            onPress={handleUpdateProfile}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Feather name="search" size={24} color="#999" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/all_courses')}>
          <FontAwesome name="th-large" size={24} color="#999" />
          <Text style={styles.navText}>All Course</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/my_courses')}>
          <FontAwesome name="book" size={24} color="#999" />
          <Text style={styles.navText}>My Course</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Feather name="user" size={24} color="#4169E1" />
          <Text style={[styles.navText, styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Gender selection modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={GENDER_OPTIONS}
              renderItem={renderGenderOption}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.genderList}
            />
          </View>
        </View>
      </Modal>

      {/* Date picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    padding: 8,
  },
  content: {
    paddingBottom: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffcdd2",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
  },
  email: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  countryFlag: {
    padding: 16,
  },
  flagText: {
    fontSize: 24,
  },
  phoneInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  dropdownText: {
    color: "#999",
    fontSize: 16,
  },
  dropdownIcon: {
    position: "absolute",
    right: 16,
    top: 18,
  },
  updateButton: {
    backgroundColor: "#0047AB",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    height: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: "#7a9dc9",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: "#f0f4ff",
    borderRadius: 20,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#999",
  },
  activeNavText: {
    color: "#4169E1",
  },
  // Gender dropdown modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  genderList: {
    paddingHorizontal: 16,
  },
  genderOption: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  genderOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedGenderText: {
    color: '#4169E1',
    fontWeight: 'bold',
  },
});