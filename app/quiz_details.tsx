import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import config from "./config";

export const options = {
  headerShown: false, // Disable the default header
};

export default function QuizDetailsScreen() {
  const router = useRouter();
  const { quizsetId } = useLocalSearchParams(); // Correct usage
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (quizsetId) {
      fetchQuizzes();
    } else {
      console.error("quizsetId is missing");
      setLoading(false);
    }
  }, [quizsetId]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(config.QUIZZES_API(quizsetId));
      if (!response.ok) {
        throw new Error(`Failed to fetch quizzes: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch quizzes");
      }
      setQuizzes(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderQuiz = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/quiz_start?quizId=${item?.id || "unknown"}`)}
    >
      <Text style={styles.quizName}>{item?.name || "Unnamed Quiz"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF3B30" />
      ) : error ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : quizzes.length > 0 ? (
        <FlatList
          data={quizzes}
          renderItem={renderQuiz}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyMessage}>No quizzes available for this quiz set.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    padding: 20,
  },
  card: {
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 10,
  },
  quizName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  errorMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});