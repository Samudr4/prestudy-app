import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Appbar, Button, Card, Divider } from 'react-native-paper';
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import config from './config';

export default function QuizResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [results, setResults] = useState({
    score: 62,
    totalQuestions: 100,
    correctAnswers: 10,
    incorrectAnswers: 0,
    notAttempted: 90,
    percentage: '10%',
    timeTaken: '10 m',
    rank: '1300/3223',
    points: '2341 XP'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch the results from an API
    // For now, we'll use the mock data
    setLoading(false);
  }, []);

  const handleViewSolutions = () => {
    router.push({
      pathname: '/quiz_answers',
      params: { quizId: params.quizId }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f44336" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz Result</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <Card style={styles.scoreCard}>
          <Card.Content style={styles.scoreCardContent}>
            <Text style={styles.scoreTitle}>Score</Text>
            <Text style={styles.scoreValue}>{results.score}</Text>
            <Text style={styles.outOf}>OUT OF {results.totalQuestions}</Text>
          </Card.Content>
        </Card>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="help-circle" size={24} color="#3498db" />
            </View>
            <Text style={styles.detailLabel}>Total Questions</Text>
            <Text style={styles.detailValue}>{results.totalQuestions}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <AntDesign name="checkcircle" size={22} color="#2ecc71" />
            </View>
            <Text style={styles.detailLabel}>Correct Answers</Text>
            <Text style={styles.detailValue}>{results.correctAnswers}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <AntDesign name="closecircle" size={22} color="#e74c3c" />
            </View>
            <Text style={styles.detailLabel}>Incorrect Answers</Text>
            <Text style={styles.detailValue}>{results.incorrectAnswers}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="help-circle" size={24} color="#95a5a6" />
            </View>
            <Text style={styles.detailLabel}>Not Attempted</Text>
            <Text style={styles.detailValue}>{results.notAttempted}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons name="percent" size={24} color="#9b59b6" />
            </View>
            <Text style={styles.detailLabel}>Percentage</Text>
            <Text style={styles.detailValue}>{results.percentage}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="time" size={24} color="#3498db" />
            </View>
            <Text style={styles.detailLabel}>Time Taken</Text>
            <Text style={styles.detailValue}>{results.timeTaken}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={18} color="white" />
          <Text style={styles.shareButtonText}>Share Result</Text>
        </TouchableOpacity>

        <Card style={styles.rankCard}>
          <Card.Content>
            <Text style={styles.rankTitle}>Your Rank</Text>
            <View style={styles.rankContainer}>
              <View style={styles.rankBox}>
                <Text style={styles.rankValue}>{results.rank}</Text>
                <Text style={styles.rankLabel}>Overall Rank <AntDesign name="arrowup" size={16} color="#f44336" /></Text>
              </View>
              <Divider style={styles.rankDivider} />
              <View style={styles.pointsBox}>
                <Text style={styles.pointsValue}>{results.points}</Text>
                <Text style={styles.pointsLabel}>Total points <AntDesign name="arrowup" size={16} color="#f44336" /></Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <TouchableOpacity 
          style={styles.solutionsButton}
          onPress={handleViewSolutions}
        >
          <Text style={styles.solutionsButtonText}>View Solutions</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#f44336',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex:.1,
    padding: 16,
  },
  scoreCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  scoreCardContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  outOf: {
    fontSize: 12,
    color: '#666',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  rankCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  rankContainer: {
    flexDirection: 'row',
  },
  rankBox: {
    flex: 1,
    paddingRight: 16,
  },
  rankValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 4,
  },
  rankLabel: {
    fontSize: 14,
    color: '#666',
  },
  rankDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  pointsBox: {
    flex: 1,
    paddingLeft: 16,
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  solutionsButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  solutionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
}); 