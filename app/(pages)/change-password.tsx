import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function ChangePasswordScreen() {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
                    <Text style={tw`text-xl font-bold text-gray-800`}>Change Password</Text>
                </View>
            </View>

            <ScrollView style={tw`flex-1 px-8`} showsVerticalScrollIndicator={false}>
                {/* Old Password */}
                <View style={tw`flex-row items-center border border-gray-200 rounded-xl px-4 mb-5`}>
                    <TextInput
                        placeholder="Old Password"
                        secureTextEntry={!showOld}
                        style={tw`flex-1 py-5 text-base`}
                        placeholderTextColor="#ccc"
                    />
                    <Pressable onPress={() => setShowOld(!showOld)}>
                        <Ionicons name={showOld ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                    </Pressable>
                </View>

                {/* New Password */}
                <View style={tw`flex-row items-center border border-gray-200 rounded-xl px-4 mb-5`}>
                    <TextInput
                        placeholder="New Password"
                        secureTextEntry={!showNew}
                        style={tw`flex-1 py-5 text-base`}
                        placeholderTextColor="#ccc"
                    />
                    <Pressable onPress={() => setShowNew(!showNew)}>
                        <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                    </Pressable>
                </View>

                {/* Confirm Password */}
                <View style={tw`flex-row items-center border border-gray-200 rounded-xl px-4 mb-10`}>
                    <TextInput
                        placeholder="Confirm Password"
                        secureTextEntry={!showConfirm}
                        style={tw`flex-1 py-5 text-base`}
                        placeholderTextColor="#ccc"
                    />
                    <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                        <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                    </Pressable>
                </View>

                <Pressable
                    onPress={() => {
                        Alert.alert("Success", "Password changed successfully!");
                        router.back();
                    }}
                    style={tw`bg-[#10B981] py-4 rounded-xl items-center`}
                >
                    <Text style={tw`text-white text-lg font-bold`}>Save</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
