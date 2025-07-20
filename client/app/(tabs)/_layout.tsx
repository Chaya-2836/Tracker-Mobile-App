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
              // הסרנו padding ו-margin מיותרים
              padding: 0,
              margin: 0,
              height: isLargeScreen ? 100 : 80, // גובה ה-Header מוגדל
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: isLargeScreen ? 20 : 10, // מרווח מינימלי בצדדים
              }}
            >
              <Image
                source={require('../../assets/images/engagement_tracker_logo_transparent.png')}
                style={{
                  width: isLargeScreen ? 300 : 220, // רוחב גדול יותר
                  height: isLargeScreen ? 80 : 60,  // גובה גדול יותר
                }}
                resizeMode="contain"
              />

              <TouchableOpacity onPress={() => console.log('Logout pressed')}>
                <Ionicons
                  name="log-out-outline"
                  size={isLargeScreen ? 32 : 28} // מעט גדול יותר
                  color={Colors[colorScheme ?? 'light'].tint}
                />
              </TouchableOpacity>
            </View>
          </View>
        ),
        headerShown: true,
        tabBarStyle: { display: 'none' }, // Hide the bottom tab bar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton: () => null, // Prevents rendering of the tab button
        }}
      />
    </Tabs>
  );
}
