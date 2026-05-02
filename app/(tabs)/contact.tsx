import React, { useState } from "react";
import { View, Text, Pressable, StatusBar, DeviceEventEmitter, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import tw from 'twrnc';
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, useCurrentUser } from "../../redux/features/auth/authSlice";
import { deleteItem } from "../../redux/hooks/storage";

export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const user = useAppSelector(useCurrentUser);
  const dispatch = useAppDispatch();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
          onPress: async () => {
            // Clear storage
            await deleteItem('accessToken');
            await deleteItem('userData');
            // Clear Redux
            dispatch(logout());
            router.dismissAll();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const ProfileItem = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
    <View style={tw`flex-row items-center bg-white border border-gray-100 rounded-2xl px-5 py-5 mb-4 shadow-sm`}>
      <View style={tw`w-12 h-12 bg-[#10B981]/10 rounded-full items-center justify-center mr-4`}>
        <Ionicons name={icon as any} size={22} color="#10B981" />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider`}>{label}</Text>
        <Text style={tw`text-lg font-bold text-gray-800`}>{value || 'Not set'}</Text>
      </View>
    </View>
  );

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
              <View style={tw`w-40 h-40 rounded-full border-4 border-[#10B981]/20 p-1`}>
                <View style={tw`w-full h-full rounded-full overflow-hidden bg-gray-100`}>
                  {image ? (
                    <Image source={{ uri: image }} style={tw`w-full h-full`} />
                  ) : (
                    <Image
                      source={{ uri: user?.avatar || 'https://avatar.iran.liara.run/public/boy?username=' + (user?.name || 'User') }}
                      style={tw`w-full h-full`}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
              <Pressable
                onPress={pickImage}
                style={tw`absolute bottom-2 right-2 w-12 h-12 bg-white border-2 border-[#10B981] rounded-full items-center justify-center shadow-lg`}
              >
                <Ionicons name="camera" size={24} color="#10B981" />
              </Pressable>
            </View>
            <Text style={tw`text-3xl font-black text-gray-800 mt-6`}>{user?.name || 'Guest User'}</Text>
            <Text style={tw`text-base text-gray-400 mt-1`}>Member since April 2024</Text>
          </View>

          {/* User Data Display */}
          <View style={tw`mt-2`}>
            <ProfileItem label="Full Name" value={user?.name} icon="person-outline" />
            <ProfileItem label="Email Address" value={user?.email} icon="mail-outline" />
            <ProfileItem label="Phone Number" value={user?.phone} icon="call-outline" />
            <ProfileItem label="Gender" value={user?.gender} icon="transgender-outline" />
            <ProfileItem label="Role" value={user?.role} icon="shield-checkmark-outline" />
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            style={tw`mt-12 bg-[#EF4444]/5 border border-[#EF4444]/20 py-5 rounded-2xl items-center`}
          >
            <Text style={tw`text-[#EF4444] font-bold text-xl`}>Logout Account</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

