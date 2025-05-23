import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar, Platform } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import config, { apiRequest } from "./config";
import { Redirect } from "expo-router";
import BottomNav from "./components/BottomNav";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

export default function AllCoursesRedirect() {
  return <Redirect href="/(tabs)/all_courses" />;
}

export function AllCoursesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const response = await apiRequest(`${config.CATEGORY_API}?type=course`, {
        method: 'GET'
      });
      
      if (response.success && response.data) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.message || "No categories available");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: "/category_details",
      params: { categoryId, categoryName }
    });
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleCategoryPress(item._id, item.name)}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name="book" size={24} color="#4169E1" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      {item.description && (
        <Text style={styles.categoryDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const headerComponent = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>All Course Categories</Text>
    </View>
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
          onPress={fetchCategories}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No categories available</Text>}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 8,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  }
});