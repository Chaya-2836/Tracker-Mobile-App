import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as AuthSession from 'expo-auth-session';

const auth0Domain = 'dev-ygpkcykyx3jnljrc.us.auth0.com';
const clientId = 'AImF7UlzPmK9f73OXBe6Is7muwL9Atsz';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true, // Works in Expo Go
    });

    const authUrl = `https://${auth0Domain}/authorize?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=openid profile email`;

    const result = await AuthSession.startAsync({ authUrl });

    setIsLoading(false);

    if (result.type === 'success') {
      console.log('Access token:', result.params.access_token);
      setIsLoggedIn(true);
    } else {
      console.error('Login failed or cancelled', result);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <Text style={styles.text}>Welcome! You are logged in</Text>
          <Button title="Log out" onPress={handleLogout} />
        </>
      ) : (
        <Button title="Login with Auth0" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 20 },
});
