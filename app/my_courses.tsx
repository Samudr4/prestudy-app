import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyCoursesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Courses</Text>
      <Text style={styles.description}>
        This is the My Courses page. Display the courses the user is enrolled in here.
      </Text>
      <Text style={styles.description}>
        You are currently enrolled in 3 courses.
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});