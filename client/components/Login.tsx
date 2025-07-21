import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../components/AuthProvider';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Engagement Tracker</Text>
      <Button title="Login with Auth0" onPress={login} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 24, marginBottom: 20,
  },
});
