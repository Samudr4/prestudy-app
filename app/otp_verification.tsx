import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config, { apiRequest, setAuthToken } from './config';

export default function OTPVerification() {
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      
      const response = await apiRequest(config.REQUEST_OTP_API, {
        method: 'POST',
        body: JSON.stringify({ phoneNumber })
      });
      
      if (response.success) {
        setTimer(30);
        setResendDisabled(true);
        startTimer();
        Alert.alert('Success', 'OTP has been resent to your mobile number');
      } else {
        throw new Error(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiRequest(config.VERIFY_OTP_API, {
        method: 'POST',
        body: JSON.stringify({ 
          phoneNumber, 
          otp: otpString 
        })
      });
      
      if (response.success) {
        // Store auth token and user data
        await setAuthToken(response.token);
        await AsyncStorage.setItem('userPhone', phoneNumber as string);
        
        if (response.isNewUser) {
          // If it's a new user, redirect to complete profile
          router.replace('/profile');
        } else {
          // For existing users, go to home
          router.replace('/(tabs)');
        }
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Please check your OTP and try again');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>OTP Verification</Text>
            <View style={styles.emptyView} />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.verificationText}>
              We've sent a verification code to
            </Text>
            <Text style={styles.phoneText}>+91 {phoneNumber}</Text>
            
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                />
              ))}
            </View>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {resendDisabled
                  ? `Resend OTP in ${timer} seconds`
                  : 'Didn\'t receive the code?'}
              </Text>
              {!resendDisabled && (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={loading}
                >
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity
              style={[
                styles.verifyButton,
                otp.join('').length !== 4 && styles.verifyButtonDisabled
              ]}
              onPress={handleVerifyOTP}
              disabled={otp.join('').length !== 4 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyView: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendText: {
    fontSize: 16,
    color: '#1a4aa1',
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#1a4aa1',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 