import React, { useState, useRef, useEffect } from "react";
import { Animated, DeviceEventEmitter } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import tw from 'twrnc';
import { MenuSidebar } from "../../components/MenuSidebar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('toggleSidebar', (open: boolean) => {
      if (open) setIsSidebarOpen(true);
      Animated.timing(sidebarAnim, {
        toValue: open ? 0 : -500,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        if (!open) setIsSidebarOpen(false);
      });
    });

    return () => subscription.remove();
  }, [sidebarAnim]);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            tw`absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 shadow-sm`,
            isSidebarOpen ? { display: 'none' } : {}
          ],
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: tw`text-xs font-bold mb-2`,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favourite"
          options={{
            title: "Favourite",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "heart" : "heart-outline"} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "wallet" : "wallet-outline"} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="offer"
          options={{
            title: "Offer",
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? "sale" : "sale-outline"} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="contact"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
            ),
          }}
        />

        {/* Hide non-essential tabs */}
        <Tabs.Screen name="about" options={{ href: null }} />
      </Tabs>

      <MenuSidebar
        isOpen={isSidebarOpen}
        onClose={() => DeviceEventEmitter.emit('toggleSidebar', false)}
        animValue={sidebarAnim}
      />
    </>
  );
}
