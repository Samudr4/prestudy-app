import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { quizId, price, quizName } = params;
  
  const handlePayment = () => {
    // In a real app, you would process the payment
    // For now, just navigate to the declaration screen
    router.push({
      pathname: '/declaration_screen',
      params: { quizId, quizName }
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d47a1" barStyle="light-content" />
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content title="#Sub-category 1" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="dots-vertical" color="white" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.confirmContainer}>
        <Text style={styles.confirmTitle}>Confirm</Text>
        
        <View style={styles.policyContainer}>
          <View style={styles.policyItem}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.policyText}>This quiz set is not refundable</Text>
          </View>
          
          <Text style={styles.termsText}>
            Please refer to our <Text style={styles.termsLink}>Terms and Conditions</Text> for more details.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay ₹{price || 199}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.quizList}>
        {/* Quiz list would show below similar to quiz_details.tsx content */}
      </View>

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
  confirmContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 16,
    borderRadius: 10,
    elevation: 2,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  policyContainer: {
    marginBottom: 24,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starIcon: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 8,
  },
  policyText: {
    fontSize: 14,
    color: '#333',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
  },
  termsLink: {
    color: '#0d47a1',
    textDecorationLine: 'underline',
  },
  payButton: {
    backgroundColor: '#f44336',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quizList: {
    flex: 1,
    paddingHorizontal: 16,
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