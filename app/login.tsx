import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    const userHasAccount = phoneNumber === "1234567890"; // Example condition
    if (userHasAccount) {
      router.push("/home");
    } else {
      router.push("/signup");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://raw.githubusercontent.com/Samudr4/prestudy-app/refs/heads/main/logo.jpg" }}
        style={styles.logo}
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        mode="outlined"
        placeholder="Enter Phone Number"
        left={<TextInput.Icon icon="phone" />}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Enter OTP</Text>
      <TextInput
        mode="outlined"
        placeholder="******"
        left={<TextInput.Icon icon="lock" />}
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Log in
      </Button>
      <Text style={styles.footerText}>
        Don’t have an account? <Text style={styles.linkText} onPress={() => router.push("/signup")}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    backgroundColor: "#FF3B30",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  linkText: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
});