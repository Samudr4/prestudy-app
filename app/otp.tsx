import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";

export default function OtpScreen() {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    console.log("OTP Verified:", otp);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP</Text>
      <TextInput
        mode="outlined"
        placeholder="******"
        left={<TextInput.Icon icon="lock" />}
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        keyboardType="number-pad"
        secureTextEntry
      />
      <Button mode="contained" onPress={handleVerify} style={styles.button}>
        Verify
      </Button>
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
    backgroundColor: "#FF3B30",
  },
});