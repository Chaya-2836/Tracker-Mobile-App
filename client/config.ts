import Constants from 'expo-constants';

export const CONFIG = {
  BASE_URL: Constants.expoConfig?.extra?.BASE_URL || 'http://localhost:8021',
};
