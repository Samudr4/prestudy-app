import React, { useState } from "react";
import { View, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "./config";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleRequestOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Invalid Input", "Please enter a valid phone number.");
      return;
    }

    try {
      setIsRequestingOTP(true);
      // Format phone number with country code if not already added
      const formattedPhone = phoneNumber.startsWith("+") 
        ? phoneNumber 
        : `+91${phoneNumber}`;

      const response = await fetch(`${config.AUTH_API}/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
      });

      const data = await response.json();

      if (data.success) {
        setShowOTPInput(true);
        Alert.alert("Success", `OTP sent to ${formattedPhone}. Please check your messages.`);
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP request error:", error);
      Alert.alert("Error", "Failed to connect to server. Please check your connection.");
      
      // For development/demo, proceed to OTP screen anyway
      setShowOTPInput(true);
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Invalid Input", "Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setIsVerifyingOTP(true);
      
      // Format phone number with country code if not already added
      const formattedPhone = phoneNumber.startsWith("+") 
        ? phoneNumber 
        : `+91${phoneNumber}`;
      
      // In a real app, this would verify with Firebase
      // For demo purposes, we'll simulate a verification
      const idToken = "sample-firebase-token";
      
      // Make the API call to verify OTP
      const response = await fetch(`${config.AUTH_API}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          idToken,
          phoneNumber: formattedPhone // Send phone for demo fallback
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the user token
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userPhone", formattedPhone);
        
        Alert.alert("Success", "OTP verified successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/home")
          }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      
      // For demo/development fallback
      Alert.alert("Notice", "Using demo mode. In production, this would verify with the backend.", [
        {
          text: "OK",
          onPress: async () => {
            // Store demo token for testing
            await AsyncStorage.setItem("userToken", "sample-firebase-token");
            await AsyncStorage.setItem("userPhone", phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`);
            router.push("/home");
          }
        }
      ]);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://github.com/Samudr4/prestudy-app/blob/main/assets/logo.jpg" }}
        style={styles.logo}
      />
      
      {!showOTPInput ? (
        // Phone Number Input Screen
        <>
          <Text style={styles.title}>Sign in with Phone</Text>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            mode="outlined"
            placeholder="Enter Phone Number"
            left={<TextInput.Icon icon="phone" />}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
            disabled={isRequestingOTP}
          />
          <Button 
            mode="contained" 
            onPress={handleRequestOTP} 
            style={styles.button}
            disabled={isRequestingOTP}
          >
            {isRequestingOTP ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              "Get OTP"
            )}
          </Button>
        </>
      ) : (
        // OTP Verification Screen
        <>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.label}>Enter the OTP sent to {phoneNumber}</Text>
          <TextInput
            mode="outlined"
            placeholder="Enter 6-digit OTP"
            left={<TextInput.Icon icon="lock" />}
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            disabled={isVerifyingOTP}
          />
          <Button 
            mode="contained" 
            onPress={handleVerifyOTP} 
            style={styles.button}
            disabled={isVerifyingOTP}
          >
            {isVerifyingOTP ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              "Verify & Sign In"
            )}
          </Button>
          <Button 
            mode="text" 
            onPress={() => setShowOTPInput(false)}
            style={styles.backButton}
            disabled={isVerifyingOTP}
          >
            Change Phone Number
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "topstart",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#4169E1",
    paddingVertical: 6,
  },
  backButton: {
    marginTop: 10,
  },
});