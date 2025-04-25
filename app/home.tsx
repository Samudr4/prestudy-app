import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, Dimensions } from "react-native";
import { BottomNavigation } from "react-native-paper";
import { useRouter } from "expo-router";
import config from "./config";
import { AntDesign, FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';

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

export const options = {
  headerShown: false,
};

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [examCategories, setExamCategories] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "explore", title: "Explore", icon: "compass" },
    { key: "all_courses", title: "All Courses", icon: "book" },
    { key: "my_courses", title: "My Courses", icon: "bookmark" },
    { key: "profile", title: "Profile", icon: "account" },
  ]);

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

  // Navigate directly when bottom tab changes
  const handleTabChange = (newIndex: number) => {
    setIndex(newIndex);
    const routeKey = routes[newIndex].key;
    switch (routeKey) {
      case 'all_courses':
        router.push('/all_courses');
        break;
      case 'my_courses':
        router.push('/my_courses');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  };

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
      <Image source={require('../assets/emblem.svg')} style={styles.examLogo} />
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

  const renderExplore = () => {
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
                  renderItem={renderCourseCategory}
                  keyExtractor={c => c._id}
                />
              </View>
            );
          }
          return (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Exam Categories</Text>
                <AntDesign name="right" size={20} color="#FF6347" />
              </View>
              <FlatList
                data={examCategories}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.examCategoriesList}
                renderItem={renderExamCategory}
                keyExtractor={e => e._id}
              />
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleTabChange}
      renderScene={({ route }) =>
        route.key === 'explore' ? renderExplore() : <View style={styles.scene} />
      }
      barStyle={styles.bottomBar}
      renderIcon={({ route, focused }) => {
        const color = focused ? '#2196F3' : '#757575';
        switch (route.key) {
          case 'explore':
            return <FontAwesome name="search" size={24} color={color} />;
          case 'all_courses':
            return <FontAwesome name="th-large" size={24} color={color} />;
          case 'my_courses':
            return <Feather name="book" size={24} color={color} />;
          case 'profile':
            return <Feather name="user" size={24} color={color} />;
          default:
            return null;
        }
      }}
      renderLabel={({ route, focused }) => (
        <Text style={[styles.bottomBarLabel, { color: focused ? '#2196F3' : '#757575' }]}>
          {route.title}
        </Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
  errorMessage: {
    textAlign: 'center',
    color: '#FF3B30',
    marginBottom: 20,
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
  sectionContainer: { marginVertical: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  courseCategoriesList: { paddingLeft: 16, paddingRight: 8 },
  courseCategoryCard: { width: 120, backgroundColor: '#fff', borderRadius: 12, padding: 16, marginRight: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  iconContainer: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  handIcon: { position: 'absolute', bottom: -5, right: -5 },
  courseCategoryName: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginVertical: 8, color: '#333' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, color: '#666', marginLeft: 4 },
  examCategoriesList: { paddingHorizontal: 16 },
  examCategoryCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  examLogo: { width: 70, height: 70, marginRight: 12 },
  examDetailContainer: { flex: 1 },
  examCategoryName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  examDescription: { fontSize: 14, color: '#666', marginTop: 4 },
  examFullName: { fontSize: 12, color: '#333', marginTop: 4 },
  bannerContainer: { width: screenWidth, height: 200, marginBottom: 16 },
  bannerImage: { width: screenWidth, height: '100%' },
  bottomBar: { backgroundColor: '#fff', height: 60, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  bottomBarLabel: { fontSize: 12, marginTop: 2 },
  scene: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
