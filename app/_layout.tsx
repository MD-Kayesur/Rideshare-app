import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { useAppDispatch } from '../redux/hooks';
import { getItem } from '../redux/hooks/storage';
import { setUser } from '../redux/features/auth/authSlice';
import { RideRequestOverlay } from '../components/RideRequestOverlay';

// Only import CSS on web - NativeWind handles mobile automatically via Metro
if (Platform.OS === 'web') {
  require('./global.css');
}

function RootLayoutNav() {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getItem('accessToken');
        const userData = await getItem('userData');
        
        if (token) {
          const user = userData ? JSON.parse(userData) : null;
          dispatch(setUser({ user, token }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();

    if (Platform.OS === 'web') {
      try {
        const { StyleSheet } = require('react-native');
        if (StyleSheet.setFlag) {
          StyleSheet.setFlag('darkMode', 'class');
        }
      } catch (e) {}
    }
  }, [dispatch]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout/[id]" />
        <Stack.Screen name="+not-found" options={{ headerShown: true }} />
      </Stack>
      <RideRequestOverlay />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
