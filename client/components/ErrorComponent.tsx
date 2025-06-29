import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ErrorComponent({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffeeee",
    borderRadius: 8,
  },
  text: {
    color: "#cc0000",
    fontSize: 16,
    textAlign: "center",
  },
});
// This component is used to display error messages in a consistent style across the app.
// It can be reused in different parts of the application where error handling is needed.