import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
    title: 'Home',
    tabBarLabel: () => null,
              tabBarIcon: ({ color }) => (
      <Image
        source={require('../../assets/images/image.png')}
        style={{ width: 86, height: 86, tintColor: color }}
        resizeMode="contain"
      />
    ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons name="paper-plane" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
