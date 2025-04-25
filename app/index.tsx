export const options = {
  headerShown: false, // Disable the default header
};

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleCategoryPress = (category) => {
    router.push({
      pathname: "/category_details",
      params: { categoryId: category._id, categoryName: category.name },
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://github.com/Samudr4/prestudy-app/blob/main/assets/logo.jpg" }}
        style={styles.logo}
      />
      <Text style={styles.title}>Crack Your Dream Exam with App Name</Text>
      <Text style={styles.subtitle}>Way to smart study</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Sign up / Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/home")}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  skipText: {
    color: "#FF3B30",
    fontSize: 14,
  },
});