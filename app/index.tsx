import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet, Image } from 'react-native';
import { isAuthenticated, clearAuth } from "./config";

export default function IndexPage() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate a brief splash screen delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear any stored auth tokens
      await clearAuth();
      
      // Check if user is authenticated (should now be false)
      const authenticated = await isAuthenticated();
      setUserAuthenticated(authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUserAuthenticated(false);
    } finally {
      setIsAuthChecking(false);
    }
  };

  if (isAuthChecking) {
    return <SplashScreen />;
  }

  if (userAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>PreStudy</Text>
      <ActivityIndicator size="large" color="#4169E1" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a4aa1',
    marginBottom: 32,
  },
  loader: {
    marginTop: 20,
  }
});