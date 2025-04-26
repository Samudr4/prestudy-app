import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import config from './config';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export default function QuizAnswersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { quizId } = params;
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    // In a real app, you would fetch the quiz data with user answers from the API
    // For now, we'll create mock data
    setTimeout(() => {
      const mockQuestions: Question[] = [
        {
          id: '1',
          question: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 2, // Paris
          userAnswer: 2, // Correct
        },
        {
          id: '2',
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 1, // Mars
          userAnswer: 1, // Correct
        },
        {
          id: '3',
          question: 'What is the largest mammal?',
          options: ['Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
          correctAnswer: 1, // Blue Whale
          userAnswer: 0, // Incorrect - user selected Elephant
        },
        {
          id: '4',
          question: 'Which of the following is a prime number?',
          options: ['15', '21', '57', '23'],
          correctAnswer: 3, // 23
          userAnswer: 0, // Incorrect - user selected 15
        },
        {
          id: '5',
          question: 'Who wrote "Romeo and Juliet"?',
          options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
          correctAnswer: 1, // William Shakespeare
          userAnswer: 1, // Correct
        },
      ];
      
      setQuestions(mockQuestions);
      setLoading(false);
    }, 1000); // Simulate API delay
  };

  const handleBack = () => {
    router.back();
  };

  const handleTryAgain = () => {
    router.push({
      pathname: '/quiz_start',
      params: { quizId }
    });
  };

  const renderQuestion = ({ item, index }: { item: Question; index: number }) => {
    const isCorrect = item.userAnswer === item.correctAnswer;
    
    return (
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Question {index + 1}</Text>
          <View style={[
            styles.resultBadge,
            {backgroundColor: isCorrect ? '#d4edda' : '#f8d7da'}
          ]}>
            <Text style={[
              styles.resultText,
              {color: isCorrect ? '#155724' : '#721c24'}
            ]}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.questionText}>{item.question}</Text>
        
        <View style={styles.optionsContainer}>
          {item.options.map((option, optionIndex) => (
            <View 
              key={optionIndex}
              style={[
                styles.optionItem,
                optionIndex === item.correctAnswer && styles.correctOption,
                optionIndex === item.userAnswer && optionIndex !== item.correctAnswer && styles.incorrectOption
              ]}
            >
              <Text style={[
                styles.optionText,
                optionIndex === item.correctAnswer && styles.correctOptionText,
                optionIndex === item.userAnswer && optionIndex !== item.correctAnswer && styles.incorrectOptionText
              ]}>
                {String.fromCharCode(65 + optionIndex)}. {option}
              </Text>
              {optionIndex === item.correctAnswer && (
                <Ionicons name="checkmark-circle" size={20} color="#155724" style={styles.icon} />
              )}
              {optionIndex === item.userAnswer && optionIndex !== item.correctAnswer && (
                <Ionicons name="close-circle" size={20} color="#721c24" style={styles.icon} />
              )}
            </View>
          ))}
        </View>

        {item.userAnswer !== item.correctAnswer && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanationText}>
              The correct answer is {String.fromCharCode(65 + item.correctAnswer)}. {item.options[item.correctAnswer]}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
        <Text style={styles.loadingText}>Loading answers...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Review Answers</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTryAgain}>
          <Ionicons name="reload" size={20} color="white" />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '500',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  correctOption: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  incorrectOption: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  correctOptionText: {
    color: '#155724',
    fontWeight: '500',
  },
  incorrectOptionText: {
    color: '#721c24',
    fontWeight: '500',
  },
  icon: {
    marginLeft: 8,
  },
  explanationContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4169E1',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: '#555',
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#4169E1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 