import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../config";

// Mock data for enrolled courses
const MOCK_ENROLLED_COURSES = [
  {
    id: '1',
    title: 'General Knowledge',
    progress: 45,
    imageUri: 'https://img.freepik.com/free-vector/hand-drawn-general-knowledge-illustration_23-2149011548.jpg',
    lastAccessed: '2 days ago',
    totalQuizzes: 10,
    completedQuizzes: 4,
  },
  {
    id: '2',
    title: 'Assam History',
    progress: 75,
    imageUri: 'https://cdn2.vectorstock.com/i/1000x1000/29/96/online-learning-concept-vector-28292996.jpg',
    lastAccessed: '5 hours ago',
    totalQuizzes: 8,
    completedQuizzes: 6,
  },
  {
    id: '3',
    title: 'Mathematics',
    progress: 20,
    imageUri: 'https://img.freepik.com/free-vector/mathematics-concept-illustration_114360-3972.jpg',
    lastAccessed: '1 week ago',
    totalQuizzes: 12,
    completedQuizzes: 2,
  },
];

export default function MyCoursesScreen() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would fetch from API
      // const token = await AsyncStorage.getItem('userToken');
      // const response = await fetch(`${config.API_URL}/my-courses`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      // if (!data.success) throw new Error(data.message);
      // setEnrolledCourses(data.courses);
      
      // Using mock data for now
      setTimeout(() => {
        setEnrolledCourses(MOCK_ENROLLED_COURSES);
        setLoading(false);
      }, 800);
      
    } catch (error) {
      setError(error.message || 'Failed to fetch enrolled courses');
      setLoading(false);
    }
  };

  const renderProgressBar = (progress) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    );
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => router.push({
        pathname: '/category_details',
        params: { categoryId: item.id, categoryName: item.title }
      })}
    >
      <Image 
        source={{ uri: item.imageUri }} 
        style={styles.courseImage}
        resizeMode="cover"
      />
      <View style={styles.courseDetails}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>{item.progress}% Complete</Text>
          {renderProgressBar(item.progress)}
        </View>
        <View style={styles.courseStats}>
          <Text style={styles.statsText}>
            <Ionicons name="time-outline" size={14} color="#666" /> {item.lastAccessed}
          </Text>
          <Text style={styles.statsText}>
            <Ionicons name="checkbox-outline" size={14} color="#666" /> {item.completedQuizzes}/{item.totalQuizzes} quizzes
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMyCourses}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={22} color="#4169E1" />
        </TouchableOpacity>
      </View>

      {enrolledCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Courses Yet</Text>
          <Text style={styles.emptyText}>
            You haven't enrolled in any courses yet. Browse courses to get started.
          </Text>
          <TouchableOpacity 
            style={styles.browseCourseButton}
            onPress={() => router.push('/all_courses')}
          >
            <Text style={styles.browseCourseButtonText}>Browse Courses</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={enrolledCourses}
          renderItem={renderCourseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  filterButton: {
    padding: 8,
  },
  list: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseImage: {
    width: '100%',
    height: 140,
  },
  courseDetails: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseCourseButton: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseCourseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 