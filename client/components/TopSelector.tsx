import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import styles from "@/app/styles/topStyles";

interface TopSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

function TopSelector({ value, onChange }: TopSelectorProps) {
  return (
    <View style={styles.selector}>
      <Text style={styles.selectorLabel}>Show Top:</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={String(value)}
        onChangeText={(text) => onChange(Number(text))}
      />
    </View>
  );
}

export default TopSelector;
