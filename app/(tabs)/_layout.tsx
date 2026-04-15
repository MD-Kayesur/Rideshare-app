import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, Text, Pressable } from "react-native";
import tw from 'twrnc';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tw`absolute bottom-0 left-0 right-0 h-24 bg-white border-t-0 rounded-t-3xl shadow-lg pt-2`,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: tw`text-xs font-bold mb-4`,
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
          tabBarLabel: () => null, // Hide label for wallet
          tabBarIcon: ({ focused }) => (
            <View style={tw`items-center justify-center -mt-12`}>
              <View style={[
                tw`w-18 h-20 items-center justify-center relative`,
                { backgroundColor: 'transparent' }
              ]}>
                {/* Simulated Hexagon Shape */}
                <View style={[
                  tw`bg-[#10B981] absolute inset-0`,
                  {
                    borderRadius: 15,
                    transform: [{ rotate: '45deg' }],
                  }
                ]} />
                <Ionicons name="wallet-outline" size={30} color="white" style={tw`z-10`} />
              </View>
              <Text style={tw`text-xs font-bold text-gray-500 mt-2`}>Wallet</Text>
            </View>
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
    </Tabs>
  );
}

