import {
    Dimensions, Image,
    TouchableOpacity, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import React from 'react';
import * as AuthSession from 'expo-auth-session';

export default function Header() {
    const router = useRouter();
    const handleLogout = async () => {
        const accessToken =
            Platform.OS === 'web'
                ? localStorage.getItem('access_token')
                : await SecureStore.getItemAsync('access_token');

        if (accessToken) {
            try {
                await AuthSession.revokeAsync(
                    { token: accessToken },
                    { revocationEndpoint: 'https://oauth2.googleapis.com/revoke' }
                );
            } catch (e) {
                console.warn('Failed to revoke token', e);
            }
        }

        if (Platform.OS === 'web') {
            localStorage.removeItem('access_token');
        } else {
            await SecureStore.deleteItemAsync('access_token');
        }

        router.replace('/');
    };


    const screenWidth = Dimensions.get('window').width;
    const isLargeScreen = screenWidth >= 768;
    return (
        <View>
            <View
                style={{
                    height: isLargeScreen ? 120 : 90,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                }}
            >
                <Image
                    source={require('../../assets/images/engagement_tracker_logo_transparent.png')}
                    style={{
                        width: isLargeScreen ? 400 : 250,
                        height: '80%',
                    }}
                    resizeMode="contain"
                />
                <TouchableOpacity
                    style={{ padding: isLargeScreen ? 20 : 10 }}
                    onPress={handleLogout}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={isLargeScreen ? 30 : 24}
                        color="#2c62b4"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
