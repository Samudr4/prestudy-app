import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import config from "./config";

interface Question {
  id: string;
  text: string;
  nativeText?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId?: string;
}

export default function QuizStartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { quizId, quizName } = params;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(5060); // 84:20 in seconds
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
    
    // Set up timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      // In a real app, fetch questions from an API
      // For now, we'll use mock data
      const mockQuestions: Question[] = [
        {
          id: '1',
          text: 'The Ahoms established their last capital at ?',
          nativeText: 'আহোমসকলে নিজৰ অন্তিম ৰাজধানী প্ৰতিষ্ঠা কৰিছিল ?',
          options: [
            { id: 'A', text: 'Charaideo' },
            { id: 'B', text: 'Jorhat' },
            { id: 'C', text: 'Garhgaon' },
            { id: 'D', text: 'Maibong' },
          ],
          correctOptionId: 'A'
        },
        // Add more mock questions as needed
      ];
      
      setQuestions(mockQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    // Save the answer
    if (questions[currentQuestionIndex]) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestionIndex].id]: optionId
      }));
    }
  };

  const handleSubmit = () => {
    // Navigate to results screen
    router.push({
      pathname: '/quiz_results',
      params: { quizId }
    });
  };

  const handleQuit = () => {
    // Show confirmation dialog
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
      router.back();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      // Reset selected option to what was previously selected for this question (if any)
      const nextQuestionId = questions[currentQuestionIndex + 1].id;
      setSelectedOption(answers[nextQuestionId] || null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Reset selected option to what was previously selected for this question
      const prevQuestionId = questions[currentQuestionIndex - 1].id;
      setSelectedOption(answers[prevQuestionId] || null);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (loading || !currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f44336" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleQuit}>
          <Ionicons name="close-circle" size={28} color="white" />
        </TouchableOpacity>
        
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={22} color="#ffeb3b" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.questionInfo}>
          <Text style={styles.sectionText}>Section : General Knowledge</Text>
          <Text style={styles.questionNumberText}>
            Question : {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionPrefix}>Q:{currentQuestionIndex + 1}.</Text>
          <View style={styles.questionTextContainer}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
            {currentQuestion.nativeText && (
              <Text style={styles.nativeQuestionText}>{currentQuestion.nativeText}</Text>
            )}
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption === option.id ? styles.selectedOption : null
              ]}
              onPress={() => handleOptionSelect(option.id)}
            >
              <Text style={[
                styles.optionText,
                selectedOption === option.id ? styles.selectedOptionText : null
              ]}>
                {option.id}. {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={styles.paginationButton}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <Text style={styles.paginationButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.paginationButton, styles.nextButton]}
            onPress={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <Text style={[styles.paginationButtonText, styles.nextButtonText]}>Next</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.questionNumbersContainer}
        >
          {questions.map((q, index) => (
            <TouchableOpacity
              key={q.id}
              style={[
                styles.questionNumberButton,
                currentQuestionIndex === index ? styles.activeQuestionNumber : null,
                answers[q.id] ? styles.answeredQuestionNumber : null
              ]}
              onPress={() => setCurrentQuestionIndex(index)}
            >
              <Text style={styles.questionNumberButtonText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  closeButton: {
    padding: 5,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c62828',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  timerText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  questionInfo: {
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  questionNumberText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  questionContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  questionPrefix: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#333',
  },
  questionTextContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  nativeQuestionText: {
    fontSize: 16,
    color: '#666',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    backgroundColor: 'white',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  paginationButton: {
    backgroundColor: '#0d47a1',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4caf50',
  },
  nextButtonText: {
    color: 'white',
  },
  questionNumbersContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  questionNumberButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  questionNumberButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeQuestionNumber: {
    backgroundColor: '#2196f3',
  },
  answeredQuestionNumber: {
    backgroundColor: '#4caf50',
  },
});