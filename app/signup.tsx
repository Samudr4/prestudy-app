import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = () => {
    if (!name || !phoneNumber || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    console.log("Sign-Up Details:", { name, phoneNumber, email, password });
    alert("Sign-up successful!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        mode="outlined"
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        mode="outlined"
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Email address</Text>
      <TextInput
        mode="outlined"
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        mode="outlined"
        placeholder="********"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleSignup} style={styles.button}>
        Sign up
      </Button>
      <Text style={styles.footerText}>
        You have an account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => router.push("/login")} // Redirect to Login Page
        >
          Log in
        </Text>
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
    marginBottom: 20,
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