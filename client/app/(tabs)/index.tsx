import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';

const auth0Domain = 'https://dev-ygpkcykyx3jnljrc.us.auth0.com';
const clientId = 'AImF7UlzPmK9f73OXBe6Is7muwL9Atsz';

const discovery = {
  authorizationEndpoint: `${auth0Domain}/authorize`,
  tokenEndpoint: `${auth0Domain}/oauth/token`,
  revocationEndpoint: `${auth0Domain}/v2/logout`,
};

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri(),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      router.replace('/Dashboard');
    }
  }, [response]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/images/engagement_tracker_logo_transparent.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to Engagement Tracker</Text>
      <Text style={styles.subtitle}>Log in to continue</Text>

      {/* Button */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#2c62b4" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => promptAsync()}
          disabled={!request}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Login with SSO</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef4fb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: isSmallScreen ? width * 0.7 : width * 0.5,
    height: isSmallScreen ? height * 0.15 : height * 0.2,
    marginBottom: isSmallScreen ? 30 : 50,
  },
  title: {
    fontSize: isSmallScreen ? 22 : 28,
    fontWeight: '700',
    color: '#2c62b4',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#6c7a89',
    marginBottom: isSmallScreen ? 30 : 40,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#2c62b4',
    paddingVertical: isSmallScreen ? 12 : 15,
    paddingHorizontal: isSmallScreen ? 40 : 50,
    borderRadius: 30,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
  },
});
