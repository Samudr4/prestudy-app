import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import config from "../config";
import { AntDesign, FontAwesome, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

const bannerImages = [
  { id: "1", uri: "https://www.sellerapp.com/blog/wp-content/uploads/2023/02/mastering-amazon-banner-ads.jpg" },
  { id: "2", uri: "https://graphicsfamily.com/wp-content/uploads/edd/2023/01/Free-Burger-Promo-Banner-Design.jpg" },
  { id: "3", uri: "https://m.media-amazon.com/images/G/01/FireTV/Inline/5_BackgroundImageNotApproved._CB666803270_._TTW_.jpg" },
];

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Exam {
  _id: string;
  name: string;
  description?: string;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [examCategories, setExamCategories] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerFlatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => {
        const next = (prev + 1) % bannerImages.length;
        bannerFlatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, examRes] = await Promise.all([
        fetch(`${config.CATEGORY_API}?type=course`),
        fetch(`${config.CATEGORY_API}?type=exam`),
      ]);
      if (!courseRes.ok || !examRes.ok) throw new Error("Failed to fetch data");
      const [courseData, examData] = await Promise.all([courseRes.json(), examRes.json()]);
      if (!courseData.success || !examData.success) throw new Error("Invalid data format received");
      setCategories(courseData.data);
      setExamCategories(examData.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    router.push({ pathname: '/category_details', params: { categoryId: category._id, categoryName: category.name } });
  };

  const handleExamPress = (exam: Exam) => {
    router.push({ pathname: '/category_details', params: { categoryId: exam._id, categoryName: exam.name } });
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
  };

  const handleLeaderboardPress = () => {
    router.push('/leaderboard');
  };

  const renderCourseCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.courseCategoryCard} onPress={() => handleCategoryPress(item)}>
      <View style={styles.iconContainer}>
        <FontAwesome name="book" size={24} color="#4169E1" />
        <MaterialIcons name="volunteer-activism" size={24} color="#4169E1" style={styles.handIcon} />
      </View>
      <Text style={styles.courseCategoryName}>{item.name}</Text>
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <AntDesign key={i} name="star" size={12} color={i < 4 ? "#FFD700" : "#e0e0e0"} />
        ))}
        <Text style={styles.ratingText}>4.5 ({Math.floor(Math.random() * 200) + 100})</Text>
      </View>
    </TouchableOpacity>
  );

  const renderExamCategory = ({ item }: { item: Exam }) => (
    <TouchableOpacity style={styles.examCategoryCard} onPress={() => handleExamPress(item)}>
      <Image source={require('../../assets/emblem.svg')} style={styles.examLogo} />
      <View style={styles.examDetailContainer}>
        <Text style={styles.examCategoryName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <AntDesign key={i} name="star" size={12} color={i < 4 ? "#FFD700" : "#e0e0e0"} />
          ))}
          <Text style={styles.ratingText}>4.5 ({Math.floor(Math.random() * 200) + 100})</Text>
        </View>
        <Text style={styles.examDescription}>{item.description || "GK, Reasoning etc."}</Text>
        <Text style={styles.examFullName}>The Assam Direct Recruitment Examination (ADRE) is a state-</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBanner = () => (
    <View style={styles.bannerContainer}>
      <FlatList
        ref={bannerFlatListRef}
        data={bannerImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.bannerImage} resizeMode="cover" />
        )}
      />
    </View>
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
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PreStudy App</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotificationsPress}>
            <Ionicons name="notifications-outline" size={24} color="#4169E1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLeaderboardPress}>
            <Ionicons name="trophy-outline" size={24} color="#4169E1" />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={[{ key: 'banner' }, { key: 'courses' }, { key: 'exams' }]}
        keyExtractor={item => item.key}
        renderItem={({ item }) => {
          if (item.key === 'banner') return renderBanner();
          if (item.key === 'courses') {
            return (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>All Course Categories</Text>
                  <AntDesign name="right" size={20} color="#FF6347" />
                </View>
                <FlatList
                  data={categories}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.courseCategoriesList}
                  keyExtractor={item => item._id}
                  renderItem={renderCourseCategory}
                />
              </View>
            );
          }
          if (item.key === 'exams') {
            return (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Exam Categories</Text>
                  <AntDesign name="right" size={20} color="#FF6347" />
                </View>
                <FlatList
                  data={examCategories}
                  contentContainerStyle={styles.examCategoriesList}
                  keyExtractor={item => item._id}
                  renderItem={renderExamCategory}
                />
              </View>
            );
          }
          return null;
        }}
      />
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
  bannerContainer: {
    height: 180,
    overflow: 'hidden',
    borderRadius: 12,
    margin: 16,
  },
  bannerImage: {
    width: screenWidth - 32,
    height: 180,
    borderRadius: 12,
  },
  sectionContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    flexDirection: 'row',
    marginBottom: 10,
  },
  handIcon: {
    marginLeft: -8,
    marginTop: -8,
  },
  courseCategoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
  examLogo: {
    width: 60,
    height: 60,
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
    marginBottom: 4,
  },
  examFullName: {
    fontSize: 12,
    color: '#888',
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
  }
}); 