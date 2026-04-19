import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function VerificationMethodScreen() {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`px-6 pt-2 flex-row items-center`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg text-gray-800 ml-1`}>Back</Text>
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={tw`flex-grow px-8 pt-12 pb-10`}
                showsVerticalScrollIndicator={false}
            >
                <View style={tw`flex-1`}>
                    <Text style={tw`text-3xl font-bold text-gray-800 mb-10`}>
                        Verification email or phone number
                    </Text>

                    <TextInput
                        placeholder="Email or phone number"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white mb-6`}
                        placeholderTextColor="#ccc"
                    />
                </View>

                {/* Send OTP Button - Pushed to bottom */}
                <Pressable
                    onPress={() => router.push("/(auth)/verify")}
                    style={({ pressed }) => [
                        tw`bg-[#10B981] py-4 rounded-xl items-center`,
                        pressed && tw`opacity-90`
                    ]}
                >
                    <Text style={tw`text-white font-bold text-lg`}>Send OTP</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
