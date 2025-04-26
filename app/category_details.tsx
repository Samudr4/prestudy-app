import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, StatusBar } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Appbar, Card, ActivityIndicator } from "react-native-paper";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import config from "./config";

export const options = {
  headerShown: false,
};

export default function CategoryDetailsScreen() {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      // You'd replace this with your actual API call
      // const response = await fetch(`${config.API_URL}/categories/${categoryId}/subcategories`);
      // const data = await response.json();
      // if (!data.success) throw new Error(data.message);
      // setSubcategories(data.data);
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockSubcategories = [
          { id: '1', name: 'Sub-category 1', tags: ['tags', 'tags', 'tags'], description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has', rating: 4.5 },
          { id: '2', name: 'Sub-category 2', tags: ['tags', 'tags', 'tags'], description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has', rating: 4.5 },
          { id: '3', name: 'Sub-category 3', tags: ['tags', 'tags', 'tags'], description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has', rating: 4.5 },
        ];
        setSubcategories(mockSubcategories);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to fetch subcategories');
      setLoading(false);
    }
  };

  const handleSubcategoryPress = (subcategory) => {
    router.push({
      pathname: '/quiz_details',
      params: { 
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.name
      }
    });
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <AntDesign
            key={star}
            name="star"
            size={12}
            color={star <= rating ? "#FFD700" : "#e0e0e0"}
            style={{ marginRight: 2 }}
          />
        ))}
        <Text style={styles.ratingText}>{` #quizset_rating`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d47a1" barStyle="light-content" />
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content title={categoryName} titleStyle={styles.headerTitle} />
        <Appbar.Action icon="dots-vertical" color="white" onPress={() => {}} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d47a1" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSubcategories}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={subcategories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.subcategoryCard}
              onPress={() => handleSubcategoryPress(item)}
            >
              <View style={styles.cardContent}>
                <View style={styles.imageContainer}>
                  {/* Placeholder image */}
                  <View style={styles.placeholderImage} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.subcategoryTitle}>#{item.name}</Text>
                  <Text style={styles.tagsText}>
                    {item.tags.map(tag => `#${tag}`).join(' ')}
                  </Text>
                  <Text style={styles.descriptionText}>
                    #{`quizset_description`}{item.description}
                  </Text>
                  {renderStars(item.rating)}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="compass" size={24} color="#333" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/all_courses')}>
          <Ionicons name="book-outline" size={24} color="#333" />
          <Text style={styles.navText}>All Course</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={() => router.push('/my_courses')}>
          <Ionicons name="checkmark-circle" size={24} color="#f44336" />
          <Text style={[styles.navText, styles.activeNavText]}>My Course</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0d47a1',
    elevation: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0d47a1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  subcategoryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    marginRight: 16,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  subcategoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  tagsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 60,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavItem: {
    borderTopWidth: 3,
    borderTopColor: '#f44336',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
  activeNavText: {
    color: '#f44336',
  },
});