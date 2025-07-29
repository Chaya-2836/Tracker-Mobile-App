import { router, Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Image, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth >= 768;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}



