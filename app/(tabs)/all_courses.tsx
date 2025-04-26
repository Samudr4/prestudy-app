import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import config from "../config";

export default function AllCoursesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(config.CATEGORY_API);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success || !data.data) {
        throw new Error("No categories available");
      }
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBookIcon = () => (
    <View style={styles.bookIconContainer}>
      <View style={styles.bookIconInner}>
        <View style={styles.bookPage}></View>
        <View style={styles.bookPage2}></View>
      </View>
      <View style={styles.handIcon}></View>
    </View>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: "/category_details",
        params: { categoryId: item._id, categoryName: item.name }
      })}
    >
      <View style={styles.bookIconContainer}>
        {renderBookIcon()}
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
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      },
    }),
  },
  bookIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookIconInner: {
    width: 25,
    height: 25,
    position: 'relative',
  },
  bookPage: {
    width: 25,
    height: 25,
    backgroundColor: '#4169E1',
    borderRadius: 3,
  },
  bookPage2: {
    width: 25,
    height: 25,
    backgroundColor: '#6F8CFF',
    borderRadius: 3,
    position: 'absolute',
    top: -3,
    left: -3,
  },
  handIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6347',
    position: 'absolute',
    bottom: -3,
    right: -3,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 20,
  }
}); 