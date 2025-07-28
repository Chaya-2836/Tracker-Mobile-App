import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import styles from "@/styles/topStyles";

interface TopSelectorProps {
  value: number;
  Title?: string;
  onChange: (value: number) => void;
}

function TopSelector({ value, onChange, Title }: TopSelectorProps) {
  return (
    <View style={styles.selector}>
      <Text style={styles.selectorLabel}>Show Top:</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={String(value)}
        onChangeText={(text) => onChange(Number(text))}
      />
      <Text style={styles.selectorLabel}>{Title}</Text>
    </View>
  );
}

export default TopSelector;
