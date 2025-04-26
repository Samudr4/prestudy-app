import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Appbar, ActivityIndicator } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import config from "./config";

export const options = {
  headerShown: false, // Disable the default header
};

export default function QuizDetailsScreen() {
  const router = useRouter();
  const { subcategoryId, subcategoryName } = useLocalSearchParams();
  const [quizsets, setQuizsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizsets();
  }, [subcategoryId]);

  const fetchQuizsets = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      // const response = await fetch(`${config.API_URL}/subcategories/${subcategoryId}/quizsets`);
      // const data = await response.json();
      // if (!data.success) throw new Error(data.message);
      // setQuizsets(data.data);
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockQuizsets = [
          { id: '1', name: 'Quizset_Name', duration: 90, questions: 100, locked: false },
          { id: '2', name: 'Quizset_Name', duration: 90, questions: 100, locked: true, price: 199 },
          { id: '3', name: 'Quizset_Name', duration: 90, questions: 100, locked: true, price: 199 },
          { id: '4', name: 'Quizset_Name', duration: 90, questions: 100, locked: true, price: 199 },
          { id: '5', name: 'Quizset_Name', duration: 90, questions: 100, locked: true, price: 199 },
        ];
        setQuizsets(mockQuizsets);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to fetch quizsets');
      setLoading(false);
    }
  };

  const handleQuizPress = (quiz) => {
    if (quiz.locked) {
      // Navigate to payment/unlock screen
      router.push({
        pathname: '/payment',
        params: { quizId: quiz.id, price: quiz.price }
      });
    } else {
      // Navigate to declaration screen before starting quiz
      router.push({
        pathname: '/declaration_screen',
        params: { quizId: quiz.id, quizName: quiz.name }
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d47a1" barStyle="light-content" />
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content title={subcategoryName} titleStyle={styles.headerTitle} />
        <Appbar.Action icon="dots-vertical" color="white" onPress={() => {}} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d47a1" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchQuizsets}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={quizsets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.quizCard, 
                item.locked ? styles.lockedQuizCard : styles.unlockedQuizCard
              ]}
              onPress={() => handleQuizPress(item)}
            >
              <View style={styles.quizInfo}>
                <Text style={styles.quizTitle}>#{item.name}</Text>
                <View style={styles.quizDetail}>
                  <Ionicons name="time-outline" size={16} color="#fff" />
                  <Text style={styles.quizDetailText}>Duration: {item.duration} mnts</Text>
                </View>
                <View style={styles.quizDetail}>
                  <Ionicons name="document-text-outline" size={16} color="#fff" />
                  <Text style={styles.quizDetailText}>Total Question: {item.questions}</Text>
                </View>
              </View>
              
              {item.locked && (
                <View style={styles.lockContainer}>
                  <Ionicons name="lock-closed" size={24} color="#fff" />
                  <Text style={styles.priceText}>Unlock</Text>
                  <Text style={styles.priceText}>₹{item.price}</Text>
                </View>
              )}
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
  quizCard: {
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  unlockedQuizCard: {
    backgroundColor: '#ff7675',
  },
  lockedQuizCard: {
    backgroundColor: '#81c784',
  },
  quizInfo: {
    padding: 16,
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  quizDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quizDetailText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 14,
  },
  lockContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
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