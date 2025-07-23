import { Tabs } from 'expo-router';
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
        header: () => (
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              padding: 0,
              margin: 0,
              height: isLargeScreen ? 120 : 90, // Responsive height
              overflow: 'hidden', // Prevents clipping
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between', // Logo on the left, button on the right
              paddingHorizontal: 10, // Minimal spacing on sides
            }}
          >
            <Image
              source={require('../../assets/images/engagement_tracker_logo_transparent.png')}
              style={{
                width: isLargeScreen ? 400 : 250, // Responsive width
                height: '80%', // Height relative to the header
              }}
              resizeMode="contain"
            />

            <TouchableOpacity
              onPress={() => console.log('Logout pressed')}
              style={{
              padding: isLargeScreen ? 20 : 10, // Responsive padding
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={isLargeScreen ? 30 : 24}
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </TouchableOpacity>
          </View>
        ),
        headerShown: true,
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
