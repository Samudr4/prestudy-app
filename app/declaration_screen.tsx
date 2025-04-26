import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Appbar, Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function DeclarationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { quizId, quizName } = params;
  const [accepted, setAccepted] = useState(false);

  const handleStartQuiz = () => {
    if (accepted) {
      router.push({
        pathname: '/quiz_start',
        params: { quizId, quizName }
      });
    } else {
      // Show an alert or message that user needs to accept terms
      alert('Please accept the terms and conditions to proceed.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d47a1" barStyle="light-content" />
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content title={params.subcategoryName || "#Sub-category 1"} titleStyle={styles.headerTitle} />
        <Appbar.Action icon="dots-vertical" color="white" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <View style={styles.declarationCard}>
          <Text style={styles.declarationTitle}>Declaration</Text>
          
          <Text style={styles.declarationText}>
            By proceeding, you agree to the following policies:
          </Text>
          
          <View style={styles.policiesList}>
            <Text style={styles.policyItem}>
              1. All answers are final and cannot be changed after submission.
            </Text>
            <Text style={styles.policyItem}>
              2. Cheating or use of unauthorized materials is strictly prohibited.
            </Text>
            <Text style={styles.policyItem}>
              3. Ensure your internet connection is stable during the test.
            </Text>
            <Text style={styles.policyItem}>
              4. We reserve the right to invalidate test results in case of suspicious activity.
            </Text>
            <Text style={styles.policyItem}>
              5. Please refer to our <Text style={styles.linkText}>Terms and Conditions</Text> for more details.
            </Text>
          </View>
          
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={accepted ? 'checked' : 'unchecked'}
              onPress={() => setAccepted(!accepted)}
              color="#f44336"
            />
            <Text style={styles.checkboxLabel}>
              I accept the Term and Conditions
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={handleStartQuiz}
              disabled={!accepted}
            >
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
  content: {
    flex: 1,
    padding: 16,
  },
  declarationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  declarationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  declarationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  policiesList: {
    marginBottom: 20,
  },
  policyItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  linkText: {
    color: '#0d47a1',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
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