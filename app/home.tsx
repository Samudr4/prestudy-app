import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, Animated, Easing, ScrollView } from "react-native";
import { BottomNavigation } from "react-native-paper";
import { useRouter } from "expo-router";
import config from "./config";
import { Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

export const options = {
  headerShown: false, // Disable the default header
};

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [examCategories, setExamCategories] = useState([]);
  const [banners] = useState([
    { imageUrl: "https://media.coschedule.com/uploads/2023/01/marketing-mix-examples-pepsi-nitro.png?w=3840&q=75" },
    { imageUrl: "https://framerusercontent.com/images/TTppo5qdcpbnym8gG1c5mt5EG4.png" },
    { imageUrl: "https://narrato.io/blog/wp-content/uploads/2024/09/5-Ad-Copy-Examples.png" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryTree, setCategoryTree] = useState([]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
    fetchCategoryTree();

    // Slide animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -screenWidth, // Slide to the first banner
          duration: 1000, // Transition duration
          easing: Easing.inOut(Easing.ease), // Ease in and out
          useNativeDriver: true,
        }),
        Animated.delay(4000), // Stay for 2 seconds
        Animated.timing(slideAnim, {
          toValue: -screenWidth * 2, // Slide to the second banner
          duration: 3000, // Transition duration
          easing: Easing.inOut(Easing.ease), // Ease in and out
          useNativeDriver: true,
        }),
        Animated.delay(4000), // Stay for 2 seconds
        Animated.timing(slideAnim, {
          toValue: 0, // Reset to the first banner
          duration: 3000, // Transition duration
          easing: Easing.inOut(Easing.ease), // Ease in and out
          useNativeDriver: true,
        }),
        Animated.delay(4000), // Stay for 2 seconds
      ])
    ).start();
  }, [slideAnim]);

  const fetchData = async () => {
    try {
      const [courseResponse, examResponse] = await Promise.all([
        fetch(`${config.CATEGORY_API}?type=course`),
        fetch(`${config.CATEGORY_API}?type=exam`),
      ]);

      if (!courseResponse.ok || !examResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [courseData, examData] = await Promise.all([
        courseResponse.json(),
        examResponse.json(),
      ]);

      if (!courseData.success || !examData.success) {
        throw new Error("Invalid data format received");
      }

      setCategories(courseData.data); // Set course categories
      setExamCategories(examData.data); // Set exam categories
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryTree = async () => {
    try {
      const response = await fetch(`${config.CATEGORY_API}/tree`);
      if (!response.ok) {
        throw new Error("Failed to fetch category tree");
      }
      const result = await response.json();
      setCategoryTree(result.data);
    } catch (error) {
      console.error("Error fetching category tree:", error);
      setError(error.message);
    }
  };

  const renderExamCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.examCard}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.examCardContent}>
        <View style={styles.examDetails}>
          <Text style={styles.examName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.examDescription}>{item.description}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "explore", title: "Explore", icon: "compass" },
    { key: "all_courses", title: "All Course", icon: "book" },
    { key: "my_courses", title: "My Course", icon: "school" },
    { key: "profile", title: "Profile", icon: "account" },
  ]);

  const renderCategoryTree = ({ item }) => {
    const backgroundColor = item.type === 'exam' ? '#FF3B30' : '#4169E1';
    
    return (
      <View style={styles.categoryTreeItem}>
        <TouchableOpacity
          style={[styles.categoryCard, { backgroundColor }]}
          onPress={() => handleCategoryPress(item)}
        >
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{item.name}</Text>
            {item.subcategories?.length > 0 && (
              <AntDesign name="right" size={20} color="#FFF" />
            )}
          </View>
          {item.description && (
            <Text style={styles.categoryDescription}>{item.description}</Text>
          )}
        </TouchableOpacity>
        {item.subcategories?.length > 0 && (
          <View style={styles.subcategoriesContainer}>
            <FlatList
              data={item.subcategories}
              renderItem={renderSubcategory}
              keyExtractor={(subcat) => subcat._id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    );
  };

  const renderSubcategory = ({ item }) => (
    <TouchableOpacity
      style={styles.subcategoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={styles.subcategoryName}>{item.name}</Text>
      {item.subcategories?.length > 0 && (
        <View style={styles.quizSetsIndicator}>
          <Text style={styles.quizSetsCount}>
            {item.subcategories.length} Sets
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSlidingBanner = () => (
    <View style={styles.bannerContainer}>
      <Animated.View
        style={[
          styles.bannerSlider,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {banners.map((banner, index) => (
          <View key={index} style={styles.banner}>
            <Image source={{ uri: banner.imageUrl }} style={styles.bannerImage} />
          </View>
        ))}
      </Animated.View>
    </View>
  );

  const renderCourseCategories = () => (
    <FlatList
      data={categories}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.courseCategoryCard}
          onPress={() => handleCategoryPress(item)}
        >
          <Image source={{ uri: item.image }} style={styles.courseCategoryImage} />
          <Text style={styles.courseCategoryName}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item._id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );

  const renderExamCategories = () => (
    <FlatList
      data={examCategories}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.examCategoryCard}
          onPress={() => handleExamPress(item)}
        >
          <Text style={styles.examCategoryName}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item._id}
    />
  );

  const handleCategoryPress = (category) => {
    router.push({
      pathname: "/category_details",
      params: { categoryId: category._id, categoryName: category.name },
    });
  };

  const handleExamPress = (exam) => {
    router.push({
      pathname: "/category_details",
      params: { categoryId: exam._id, categoryName: exam.name },
    });
  };

  const handleViewAllCourses = () => {
    router.push('/all_courses');
  };

  const renderExploreScreen = () => {
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
        data={examCategories} // Use exam categories as the main data
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.examCategoryCard}
            onPress={() => handleExamPress(item)}
          >
            <View style={styles.examCategoryContent}>
              <Image source={{ uri: item.imageUrl }} style={styles.examCategoryImage} />
              <View style={styles.examCategoryDetails}>
                <Text style={styles.examCategoryName}>{item.name}</Text>
                <Text style={styles.examCategoryDescription}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.examCategoryList}
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            {renderSlidingBanner()}
            {renderCourseCategories()}
          </>
        }
      />
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "explore":
        return renderExploreScreen();
      case "all_courses":
        return (
          <View style={styles.scene}>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={() => router.push('/all_courses')}
            >
              <Text style={styles.navigateButtonText}>Go to All Courses</Text>
            </TouchableOpacity>
          </View>
        );
      case "my_courses":
        return (
          <View style={styles.scene}>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={() => router.push('/my_courses')}
            >
              <Text style={styles.navigateButtonText}>Go to My Courses</Text>
            </TouchableOpacity>
          </View>
        );
      case "profile":
        return (
          <View style={styles.scene}>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.navigateButtonText}>Go to Profile</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
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
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  horizontalScrollContent: {
    paddingHorizontal: 8,
  },
  horizontalCourseCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalCategoryName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
  },
  bannerContainer: {
    height: 150,
    overflow: "hidden",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 10,
  },
  bannerSlider: {
    flexDirection: "row",
    width: screenWidth * 3, // Adjust based on the number of banners
  },
  banner: {
    width: screenWidth,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  examCategoryCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  examCategoryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  examCategoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  examCategoryDetails: {
    flex: 1,
  },
  examCategoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  examCategoryDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  examCategoryRating: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  examCategoryList: {
    paddingBottom: 16,
  },
  courseCategoryCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseCategoryImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  courseCategoryName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  courseCategoryRating: {
    fontSize: 12,
    color: "#666",
  },
});