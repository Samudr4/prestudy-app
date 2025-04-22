import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import { useRouter } from "expo-router";

export default function DeclarationModal() {
  const router = useRouter();
  const [isChecked, setChecked] = useState(false);

  const handleConfirm = () => {
    router.replace("/quiz_start"); // Navigate to the quiz start screen
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Declaration</Text>
        <Text style={styles.modalText}>
          By proceeding, you agree to the following policies:
        </Text>
        <Text style={styles.modalText}>1. All answers are final and cannot be changed after submission.</Text>
        <Text style={styles.modalText}>2. Cheating or use of unauthorized materials is strictly prohibited.</Text>
        <Text style={styles.modalText}>3. Ensure your internet connection is stable during the test.</Text>
        <Text style={styles.modalText}>4. We reserve the right to invalidate test results in case of suspicious activity.</Text>
        <Text style={styles.modalText}>
          5. Please refer to our{" "}
          <Text
            style={styles.linkText}
            onPress={() => router.push("/terms-and-conditions")}
          >
            Terms and Conditions
          </Text>{" "}
          for more details.
        </Text>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isChecked ? "checked" : "unchecked"}
            onPress={() => setChecked(!isChecked)}
            color="#FF3B30"
          />
          <Text style={styles.checkboxLabel}>I accept the Terms and Conditions</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, !isChecked && styles.disabledButton]}
            onPress={handleConfirm}
            disabled={!isChecked}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()} // Close the modal
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  linkText: {
    color: "#1E88E5",
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#FFCDD2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});