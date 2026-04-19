import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StatusBar, DeviceEventEmitter, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';
import { router } from "expo-router";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    name: 'Nate Samson',
    email: 'nate@email.com',
    phone: '',
    gender: 'Male',
    address: ''
  });

  const toggleSidebar = (open: boolean) => {
    DeviceEventEmitter.emit('toggleSidebar', open);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            router.dismissAll();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`flex-row items-center px-6 py-4 mb-2`}>
          <Pressable
            onPress={() => toggleSidebar(true)}
            style={tw`w-12 h-12 bg-[#10B981]/10 rounded-xl items-center justify-center`}
          >
            <Ionicons name="menu" size={28} color="#10B981" />
          </Pressable>
          <Text style={tw`flex-1 text-2xl font-bold text-gray-800 text-center mr-12`}>Profile</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-6 pb-24`}>
          {/* Profile Image Section */}
          <View style={tw`items-center mt-4 mb-10`}>
            <View style={tw`relative`}>
              <View style={tw`w-40 h-40 rounded-full border-2 border-[#10B981] p-1 shadow-sm`}>
                <View style={tw`w-full h-full rounded-full overflow-hidden bg-gray-100`}>
                  <Image
                    source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Nate' }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <Pressable
                style={tw`absolute bottom-2 right-2 w-10 h-10 bg-white border border-[#10B981]/20 rounded-full items-center justify-center shadow-md`}
              >
                <Ionicons name="camera" size={20} color="#10B981" />
              </Pressable>
            </View>
            <Text style={tw`text-3xl font-bold text-gray-700 mt-6`}>{profile.name}</Text>
          </View>

          {/* Form Fields */}
          <View style={tw`gap-5`}>
            {/* Email */}
            <View style={tw`bg-white border border-gray-200 rounded-2xl px-5 py-4.5 shadow-sm`}>
              <TextInput
                value={profile.email}
                onChangeText={(v) => setProfile(p => ({ ...p, email: v }))}
                style={tw`text-lg text-gray-800`}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Phone */}
            <View style={tw`flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm`}>
              <View style={tw`flex-row items-center px-4 py-4.5 border-r border-gray-100`}>
                <Image
                  source={{ uri: 'https://flagcdn.com/w40/bd.png' }}
                  style={tw`w-8 h-5 rounded-sm mr-2`}
                />
                <Ionicons name="chevron-down" size={20} color="#374151" />
              </View>
              <View style={tw`flex-1 flex-row items-center px-4`}>
                <Text style={tw`text-lg text-gray-800 mr-2`}>+880</Text>
                <TextInput
                  placeholder="Your mobile number"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="phone-pad"
                  style={tw`flex-1 text-lg text-gray-800`}
                />
              </View>
            </View>

            {/* Gender */}
            <Pressable style={tw`flex-row items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4.5 shadow-sm`}>
              <Text style={tw`text-lg text-gray-800`}>{profile.gender}</Text>
              <Ionicons name="chevron-down" size={22} color="#374151" />
            </Pressable>

            {/* Address */}
            <View style={tw`bg-white border border-gray-200 rounded-2xl px-5 py-4.5 shadow-sm`}>
              <TextInput
                placeholder="Address"
                placeholderTextColor="#9CA3AF"
                multiline
                style={tw`text-lg text-gray-800 h-10`}
              />
            </View>
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            style={tw`mt-12 border border-[#10B981] py-4.5 rounded-2xl items-center shadow-sm`}
          >
            <Text style={tw`text-[#10B981] font-bold text-xl`}>Logout</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
