// Base API URL
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use appropriate IP address for development
// For Android emulator: 10.0.2.2 (emulator's localhost equivalent)
// For iOS simulator: localhost
// For physical devices: Use your computer's actual IP address
const getBaseUrl = () => {
  // Production URL - replace with your actual deployed API URL when ready
  const PRODUCTION_API_URL = "https://prestudy-api.onrender.com/api";
  
  // Set this to true when deploying to production
  const isProduction = false;
  
  if (isProduction) {
    return PRODUCTION_API_URL;
  }
  
  // Development URLs based on platform
  if (Platform.OS === 'web') {
    return "http://localhost:3000/api";
  } else if (Platform.OS === 'android') {
    return "http://10.0.2.2:3000/api";
  } else {
    // For iOS or other devices
    return "http://localhost:3000/api";
  }
};

const API_BASE_URL = getBaseUrl();
console.log(`Using API base URL: ${API_BASE_URL}`);

// API Endpoints
const config = {
  // API endpoints
  API_URL: API_BASE_URL,
  CATEGORY_API: `${API_BASE_URL}/category`,
  EXAM_API: `${API_BASE_URL}/exam`,
  USER_API: `${API_BASE_URL}/user`,
  AUTH_API: `${API_BASE_URL}/auth`,
  
  // Authentication endpoints
  REQUEST_OTP_API: `${API_BASE_URL}/auth/request-otp`,
  VERIFY_OTP_API: `${API_BASE_URL}/auth/verify-otp`,
  
  // Other app configuration
  APP_VERSION: '1.0.0',
  DEFAULT_COUNTRY_CODE: '+91',
  OTP_LENGTH: 4,
  OTP_EXPIRY_TIME: 30, // in seconds
  
  // Helper methods for accessing specific resources
  QUIZZES_API: (categoryId) => `${API_BASE_URL}/category/${categoryId}/quizzes`,
  QUIZ_DETAILS_API: (quizId) => `${API_BASE_URL}/quiz/${quizId}`,
  QUIZ_SUBMIT_API: (quizId) => `${API_BASE_URL}/quiz/${quizId}/submit`,
  USER_PROFILE_API: `${API_BASE_URL}/user/profile`,
};

export default config;

// Authentication helper functions
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return !!token;
};

export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    return true;
  } catch (error) {
    console.error("Error setting auth token:", error);
    return false;
  }
};

export const clearAuth = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userPhone');
    return true;
  } catch (error) {
    console.error("Error clearing auth data:", error);
    return false;
  }
};

// API request helper with authentication
export const apiRequest = async (url, options = {}) => {
  try {
    const token = await getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    throw error;
  }
};

// Utility Functions with improved error handling and debug logging
export const fetchCategories = async () => {
  console.log(`Fetching categories from: ${config.CATEGORY_API}`);
  try {
    const token = await getAuthToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    console.log('Request headers:', headers);
    
    const response = await fetch(config.CATEGORY_API, { headers });
    console.log('Categories response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        console.error("Error parsing error response:", e);
      }
      throw new Error(errorData.message || `Failed to fetch categories: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Categories data:', data);
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchQuizSets = async (categoryId) => {
  console.log(`Fetching quizzes for category ${categoryId}`);
  try {
    const token = await getAuthToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await fetch(config.QUIZZES_API(categoryId), { headers });
    console.log('Quiz sets response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        console.error("Error parsing error response:", e);
      }
      throw new Error(errorData.message || `Failed to fetch quiz sets: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Quiz sets data:', data);
    return data;
  } catch (error) {
    console.error("Error fetching quiz sets:", error);
    throw error;
  }
};