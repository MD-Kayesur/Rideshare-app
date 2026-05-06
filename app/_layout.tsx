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

import { useRef } from 'react';
import { socketService } from '../utils/socket';
import { Alert, Animated, Pressable, Text } from 'react-native';
import tw from 'twrnc';
import { router } from 'expo-router';

function RootLayoutNav() {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const toastAnim = useRef(new Animated.Value(-100)).current;

  const showToast = (data: any) => {
    setToast(data);
    Animated.spring(toastAnim, {
      toValue: 20,
      useNativeDriver: true,
      tension: 20,
      friction: 7
    }).start();

    setTimeout(() => {
      hideToast();
    }, 5000);
  };

  const hideToast = () => {
    Animated.timing(toastAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setToast(null));
  };

  const handleToastClick = async () => {
    if (!toast) return;
    hideToast();
    
    if (toast.type === 'complaint' && toast.metadata?.userId) {
        // Admin clicking a complaint notification
        router.push({
            pathname: '/(pages)/chat',
            params: {
                userId: toast.metadata.userId,
                userName: toast.metadata.userName || "User"
            }
        });
    } else if (toast.type === 'chat' && toast.metadata?.chatId) {
        // User clicking an admin reply notification
        router.push({
            pathname: '/(pages)/chat',
            params: {
                chatId: toast.metadata.chatId,
                userName: toast.metadata.userName || "Admin"
            }
        });
    } else {
        router.push('/(pages)/notifications');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getItem('accessToken');
        const userData = await getItem('userData');
        
        if (token) {
          const user = userData ? JSON.parse(userData) : null;
          dispatch(setUser({ user, token }));
          
          // Initialize Socket and join user room
          const socket = socketService.connect();
          if (user?._id || user?.id) {
            socket.emit('join', user._id || user.id);
            if (user.role === 'admin') {
              socket.emit('join', 'admin');
            }
          }

          // Global notification listeners
          socket.on('notification', (data: any) => {
            const currentUserId = user?._id || user?.id;
            const senderId = data.metadata?.userId;
            
            if (currentUserId && senderId && String(currentUserId) === String(senderId)) {
              return; // Don't show toast for own messages
            }
            showToast(data);
          });

          socket.on('admin-notification', (data: any) => {
            if (user?.role !== 'admin') return; 
            
            const currentUserId = user?._id || user?.id;
            const senderId = data.metadata?.userId;

            if (currentUserId && senderId && String(currentUserId) === String(senderId)) {
              return; // Don't show toast for own messages
            }
            showToast(data);
          });
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

      {toast && (
        <Animated.View 
          style={[
            tw`absolute left-4 right-4 bg-white rounded-3xl p-4 shadow-xl border-l-4 border-[#10B981] z-50`,
            { transform: [{ translateY: toastAnim }] }
          ]}
        >
          <Pressable onPress={handleToastClick}>
            <Text style={tw`font-bold text-gray-800 text-lg`}>{toast.title}</Text>
            <Text style={tw`text-gray-500 text-sm mt-1`} numberOfLines={2}>{toast.message}</Text>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51TU295Fj2lVeopQI2MkwnursVMwVbX7sCWTqubQsZ4V2tHGoaR02xqUhdstOfN586C52MXHkEIVSIzvzLWu22lXM00k8RdQaG0"}
      >
        <SafeAreaProvider>
          <RootLayoutNav />
        </SafeAreaProvider>
      </StripeProvider>
    </Provider>
  );
}
