import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function SetPasswordScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

            <ScrollView style={tw`flex-1 px-8 pt-12`} showsVerticalScrollIndicator={false}>
                <Text style={tw`text-3xl font-bold text-gray-800 text-center mb-4`}>
                    Set password
                </Text>
                <Text style={tw`text-base text-gray-400 text-center mb-12`}>
                    Set your password
                </Text>

                <View style={tw`gap-6`}>
                    {/* Password Input */}
                    <View style={tw`flex-row items-center border border-gray-200 rounded-xl bg-white px-4`}>
                        <TextInput
                            placeholder="Enter Your Password"
                            secureTextEntry={!showPassword}
                            style={tw`flex-1 py-4 text-base`}
                            placeholderTextColor="#ccc"
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#ccc" />
                        </Pressable>
                    </View>

                    {/* Confirm Password Input */}
                    <View style={tw`flex-row items-center border border-gray-200 rounded-xl bg-white px-4`}>
                        <TextInput
                            placeholder="Confirm Password"
                            secureTextEntry={!showConfirmPassword}
                            style={tw`flex-1 py-4 text-base`}
                            placeholderTextColor="#ccc"
                        />
                        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#ccc" />
                        </Pressable>
                    </View>

                    <Text style={tw`text-gray-400 text-sm mt-2`}>
                        Atleast 1 number or a special character
                    </Text>

                    {/* Register Button */}
                    <Pressable
                        onPress={() => router.push("/(auth)/profile")}
                        style={({ pressed }) => [
                            tw`bg-[#10B981] py-4 rounded-xl items-center mt-8`,
                            pressed && tw`opacity-90`
                        ]}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Register</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
