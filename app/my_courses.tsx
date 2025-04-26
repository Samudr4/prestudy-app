import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar, Image } from "react-native";
import { useRouter } from "expo-router";
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import config, { apiRequest } from "./config";
import BottomNav from "./components/BottomNav";

interface Course {
  _id: string;
  name: string;
  description?: string;
  progress?: number;
  lastAccessed?: string;
  imageUrl?: string;
}

export default function MyCoursesRedirect() {
  return <Redirect href="/(tabs)/my_courses" />;
}

export function MyCoursesScreen() {
  const router = useRouter();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      
      // Get enrolled courses from API
      const response = await apiRequest(`${config.USER_API}/enrolled-courses`, {
        method: 'GET'
      });
      
      if (response.success && response.data) {
        setMyCourses(response.data);
      } else {
        setMyCourses([]);
      }
    } catch (error) {
      console.error("Error fetching my courses:", error);
      setError("Failed to load your courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCoursePress = (course: Course) => {
    router.push({
      pathname: "/category_details",
      params: { 
        categoryId: course._id, 
        categoryName: course.name 
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item)}
    >
      <View style={styles.courseContent}>
        <View style={styles.courseImageContainer}>
          <View style={styles.courseImagePlaceholder}>
            <Ionicons name="book" size={32} color="#4169E1" />
          </View>
        </View>
        <View style={styles.courseDetails}>
          <Text style={styles.courseName}>{item.name}</Text>
          <Text style={styles.courseDescription} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${item.progress || 0}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{item.progress || 0}% completed</Text>
          </View>
          <Text style={styles.lastAccessedText}>
            Last accessed: {formatDate(item.lastAccessed)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchMyCourses}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={80} color="#cccccc" />
      <Text style={styles.emptyTitle}>No courses yet</Text>
      <Text style={styles.emptyText}>
        You haven't enrolled in any courses. Browse available courses to get started!
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => router.push('/all_courses')}
      >
        <Text style={styles.browseButtonText}>Browse Courses</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
      </View>
      
      <FlatList
        data={myCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={EmptyListComponent}
      />
      
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    color: "#FF3B30",
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseContent: {
    flexDirection: 'row',
    padding: 16,
  },
  courseImageContainer: {
    marginRight: 16,
  },
  courseImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseDetails: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  lastAccessedText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});