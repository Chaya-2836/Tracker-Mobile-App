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

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '712004940243-ork59h5gospejmhcihgq5ch4m8i4197q.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  });

useEffect(() => {
  const storeTokenAndNavigate = async () => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      const token = response.authentication.accessToken;
      console.log('Access Token:', token);

      try {
        if (Platform.OS === 'web') {
          localStorage.setItem('access_token', token);
        } else {
          await SecureStore.setItemAsync('access_token', token);
        }
      } catch (err) {
        console.error('Token storage error:', err);
      }

      router.replace('/Dashboard?fromLogin=true');
    }
  };

  storeTokenAndNavigate();
}, [response]);


  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/engagement_tracker_logo_transparent.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to Engagement Tracker</Text>
      <Text style={styles.subtitle}>Log in with Google to continue</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2c62b4" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setIsLoading(true);
            promptAsync().finally(() => setIsLoading(false));
          }}
          disabled={!request}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Login with Google</Text>
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
    elevation: 3,
    shadowColor: '#000',
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


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Image,
//   Dimensions,
// } from 'react-native';
// import * as AuthSession from 'expo-auth-session';
// import { useRouter } from 'expo-router';

// const auth0Domain = 'https://dev-ygpkcykyx3jnljrc.us.auth0.com';
// const clientId = 'hhBWw3qJVkMMcDu8zmtJtuOzkEUE82qq';

// const redirectUri = AuthSession.makeRedirectUri({
//   scheme: 'engagementtracker',
// });

// const discovery = {
//   authorizationEndpoint: `${auth0Domain}/authorize`,
//   tokenEndpoint: `${auth0Domain}/oauth/token`,
//   revocationEndpoint: `${auth0Domain}/v2/logout`,
// };

// export default function Login() {
//   console.log("Redirect URI actually being used:", redirectUri);

//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const [request, response, promptAsync] = AuthSession.useAuthRequest(
//     {
//       clientId,
//       responseType: 'token',
//       scopes: ['openid', 'profile', 'email'],
      
//       redirectUri,
//       //   extraParams: {
//       //   audience: 'https://engagement-tracker/api', // in your company, add your API to set permissions
//       // },
//     },

//     discovery
//   );
//   console.log('Redirect URI:', redirectUri);

//   useEffect(() => {
//     const fetchToken = async () => {
//       console.log('Auth request:', request);
//       console.log('Auth response:', response);

//       if (response?.type === 'success' && request?.codeVerifier && response.params?.code) {
//         console.log('Exchanging code for tokens...');
//         const tokenResult = await AuthSession.exchangeCodeAsync(
//           {
//             clientId,
//             code: response.params.code,
//             redirectUri,
//             extraParams: {
//               code_verifier: request.codeVerifier,
//             },
//           },
//           discovery
//         );


//         console.log('Access Token:', tokenResult.accessToken);
//         // You can now use tokenResult to navigate or fetch profile info
//         router.replace('/Dashboard');
//       }
//     };

//     fetchToken();
//   }, [response]);

//   return (
//     <View style={styles.container}>

//       <Image
//         source={require('../../assets/images/engagement_tracker_logo_transparent.png')}
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       <Text style={styles.title}>Welcome to Engagement Tracker</Text>
//       <Text style={styles.subtitle}>Log in to continue</Text>

//       {isLoading ? (
//         <ActivityIndicator size="large" color="#2c62b4" />
//       ) : (
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => {
//             setIsLoading(true);
//             promptAsync().finally(() => setIsLoading(false));
//           }}
//           disabled={!request}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.buttonText}>Login with SSO</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const { width, height } = Dimensions.get('window');
// const isSmallScreen = width < 375;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#eef4fb',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   logo: {
//     width: isSmallScreen ? width * 0.7 : width * 0.5,
//     height: isSmallScreen ? height * 0.15 : height * 0.2,
//     marginBottom: isSmallScreen ? 30 : 50,
//   },
//   title: {
//     fontSize: isSmallScreen ? 22 : 28,
//     fontWeight: '700',
//     color: '#2c62b4',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: isSmallScreen ? 14 : 16,
//     color: '#6c7a89',
//     marginBottom: isSmallScreen ? 30 : 40,
//     textAlign: 'center',
//     paddingHorizontal: 10,
//   },
//   button: {
//     backgroundColor: '#2c62b4',
//     paddingVertical: isSmallScreen ? 12 : 15,
//     paddingHorizontal: isSmallScreen ? 40 : 50,
//     borderRadius: 30,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: isSmallScreen ? 16 : 18,
//     fontWeight: '600',
//   },
// });


