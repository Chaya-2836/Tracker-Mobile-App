import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Image, View, Text, TouchableOpacity } from 'react-native';
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
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                position: 'absolute',
                alignSelf: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: Colors[colorScheme ?? 'light'].text,
                paddingTop: 8,
              }}
            >
              Engagement Tracker
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: isLargeScreen ? '1%' : 0,
              }}
            >
              <Image
                source={
                  isLargeScreen
                    ? require('../../assets/images/appsflyer.png')
                    : require('../../assets/images/favicon.png')
                }
                style={{
                  width: isLargeScreen ? 130 : 40,
                  height: 40,
                }}
                resizeMode="contain"
              />

              <TouchableOpacity onPress={() => console.log('Logout pressed')}>
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={Colors[colorScheme ?? 'light'].tint}
                />
              </TouchableOpacity>
            </View>
          </View>
        ),
        headerShown: true,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // 🎨 צבע פעיל של הטאב
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: () => null, // מסתיר את שם הטאב
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
          tabBarIcon: ({ color }) => (
            <Ionicons name="paper-plane" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
