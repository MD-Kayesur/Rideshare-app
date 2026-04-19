import React from "react";
import { View, Text, Pressable, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function SettingsScreen() {
    const settingsItems = [
        { id: '1', title: 'Change Password', route: '/(pages)/change-password' },
        { id: '2', title: 'Change Language', route: '/(pages)/change-language' },
        { id: '3', title: 'Privacy Policy', route: '/(pages)/privacy-policy' },
        { id: '4', title: 'Contact Us', route: '/(pages)/contact-us' },
        { id: '5', title: 'Delete Account', route: '/(pages)/delete-account' },
    ];

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`px-8 pt-6 flex-row items-center mb-10`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg font-medium text-gray-800 ml-1`}>Back</Text>
                </Pressable>
                <View style={tw`flex-1 items-center mr-10`}>
                    <Text style={tw`text-xl font-bold text-gray-800`}>Settings</Text>
                </View>
            </View>

            <ScrollView style={tw`flex-1 px-8`} showsVerticalScrollIndicator={false}>
                {settingsItems.map((item) => (
                    <Pressable
                        key={item.id}
                        onPress={() => item.route !== '#' && router.push(item.route as any)}
                        style={tw`flex-row items-center justify-between border border-[#10B981] border-opacity-30 rounded-xl p-5 mb-4`}
                    >
                        <Text style={tw`text-lg font-medium text-gray-800`}>{item.title}</Text>
                        <Ionicons name="chevron-forward" size={24} color="#333" />
                    </Pressable>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
