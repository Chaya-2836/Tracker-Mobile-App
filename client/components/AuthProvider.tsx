import React, { createContext, useContext, useState } from 'react';
import Auth0 from 'react-native-auth0';

// Configure Auth0
const auth0 = new Auth0({
  domain: 'YOUR_DOMAIN.auth0.com',
  clientId: 'YOUR_CLIENT_ID',
});

// Define the context type
type AuthContextType = {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

// Create the authentication context
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
});

// Hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle login
  const login = async () => {
    try {
      await auth0.webAuth.authorize({
        scope: 'openid', // Request authentication only
      });
      setIsLoggedIn(true);
      console.log('User authenticated');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await auth0.webAuth.clearSession();
      setIsLoggedIn(false);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
