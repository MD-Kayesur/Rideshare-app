import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Only import CSS on web - NativeWind handles mobile automatically via Metro
if (Platform.OS === 'web') {
  require('./global.css');
}



export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Fix NativeWind color scheme for web
      try {
        const { StyleSheet } = require('react-native');
        if (StyleSheet.setFlag) {
          StyleSheet.setFlag('darkMode', 'class');
        }
      } catch (e) {
        // Ignore if not available
      }
    }
  }, []);

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout/[id]" />
        <Stack.Screen name="+not-found" options={{ headerShown: true }} />
      </Stack>
    </Provider>
  );
}
