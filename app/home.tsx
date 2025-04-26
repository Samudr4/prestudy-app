import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, StatusBar, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config, { apiRequest } from "./config";
import { Redirect } from "expo-router";
import BottomNav from "./components/BottomNav";

const screenWidth = Dimensions.get('window').width;

interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface Exam {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function HomeRedirect() {
  return <Redirect href="/(tabs)/index" />;
}

function HomeScreen() {
  const router = useRouter();
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);
  const [examCategories, setExamCategories] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    fetchData();
    getUserName();
  }, []);

  const getUserName = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem('userPhone');
      
      const response = await apiRequest(config.USER_PROFILE_API, {
        method: 'GET',
        headers: {
          'X-Phone-Number': phoneNumber || '',
        }
      });
      
      if (response.success && response.user) {
        const { firstName, lastName } = response.user;
        setUserName(firstName ? `${firstName} ${lastName}`.trim() : '');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch course categories
      const categoriesResponse = await apiRequest(`${config.CATEGORY_API}?type=course`, {
        method: 'GET'
      });
      
      if (categoriesResponse.success && categoriesResponse.data) {
        setCourseCategories(categoriesResponse.data);
      }

      // Fetch exam categories
      const examsResponse = await apiRequest(`${config.CATEGORY_API}?type=exam`, {
        method: 'GET'
      });
      
      if (examsResponse.success && examsResponse.data) {
        setExamCategories(examsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    router.push({ 
      pathname: "/category_details", 
      params: { 
        categoryId: category._id, 
        categoryName: category.name 
      } 
    });
  };

  const handleExamPress = (exam: Exam) => {
    router.push({ 
      pathname: "/quiz_details", 
      params: { 
        examId: exam._id, 
        examName: exam.name 
      } 
    });
  };

  const handleNotificationsPress = () => {
    router.push("/notifications");
  };

  const handleLeaderboardPress = () => {
    router.push("/leaderboard");
  };

  const renderCourseCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.courseCategoryCard} onPress={() => handleCategoryPress(item)}>
      <View style={styles.iconContainer}>
        <FontAwesome name="graduation-cap" size={24} color="#4169E1" />
      </View>
      <Text style={styles.courseCategoryName}>{item.name}</Text>
      {item.description && (
        <Text style={styles.categoryDescription} numberOfLines={1}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderExamCategory = ({ item }: { item: Exam }) => (
    <TouchableOpacity style={styles.examCategoryCard} onPress={() => handleExamPress(item)}>
      <View style={styles.examIconContainer}>
        <FontAwesome name="file-text-o" size={24} color="#4169E1" />
      </View>
      <View style={styles.examDetailContainer}>
        <Text style={styles.examCategoryName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.examDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderBanner = () => (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>
        Welcome{userName ? ', ' + userName : ''}
      </Text>
      <Text style={styles.subtitleText}>
        Explore courses and prepare for exams
      </Text>
    </View>
  );

  const renderContent = () => {
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
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        {renderBanner()}
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Course Categories</Text>
            <TouchableOpacity onPress={() => router.push('/all_courses')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {courseCategories.length > 0 ? (
            <FlatList
              data={courseCategories}
              renderItem={renderCourseCategory}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.courseCategoriesList}
            />
          ) : (
            <Text style={styles.emptyText}>No course categories available</Text>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exam Categories</Text>
          </View>
          {examCategories.length > 0 ? (
            <FlatList
              data={examCategories}
              renderItem={renderExamCategory}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.examCategoriesList}
            />
          ) : (
            <Text style={styles.emptyText}>No exam categories available</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PreStudy</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLeaderboardPress}>
            <Feather name="award" size={22} color="#4169E1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotificationsPress}>
            <Feather name="bell" size={22} color="#4169E1" />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => renderContent()}
        keyExtractor={item => item.key}
      />
      
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4169E1',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  welcomeContainer: {
    padding: 16,
    backgroundColor: '#e8f0fe',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
  },
  sectionContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4169E1',
    fontWeight: '500',
  },
  courseCategoriesList: {
    paddingBottom: 10,
  },
  examCategoriesList: {
    paddingBottom: 20,
  },
  courseCategoryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginRight: 16,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseCategoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
  },
  examCategoryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  examIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  examDetailContainer: {
    flex: 1,
  },
  examCategoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  examDescription: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorMessage: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4169E1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
  }
});
