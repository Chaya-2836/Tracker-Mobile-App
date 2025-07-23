import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
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
      router.replace('/Dashboard'); // Navigate to Dashboard after login
    }
  }, [response]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome to Engagement Tracker</Text>
      <Button title="Login with Auth0" onPress={() => promptAsync()} disabled={!request} />
    </View>
  );
}
