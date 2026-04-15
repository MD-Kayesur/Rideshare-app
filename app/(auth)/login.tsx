import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import React, { useState } from "react";

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);

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

            <ScrollView style={tw`flex-1 px-8 pt-8`} showsVerticalScrollIndicator={false}>
                <Text style={tw`text-2xl font-bold text-gray-800 mb-8`}>
                    Sign in with your email or phone number
                </Text>

                <View style={tw`gap-5`}>
                    {/* Email/Phone Input */}
                    <TextInput
                        placeholder="Email or Phone Number"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                    />

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

                    <Pressable style={tw`items-end`} onPress={() => router.push("/(auth)/verification")}>
                        <Text style={tw`text-red-500 font-medium`}>Forgot password?</Text>
                    </Pressable>

                    {/* Sign Up Button (actually Sign In in this context based on Image 3 text) */}
                    <Pressable
                        onPress={() => router.push("/(tabs)")}
                        style={({ pressed }) => [
                            tw`bg-[#10B981] py-4 rounded-xl items-center mt-4`,
                            pressed && tw`opacity-90`
                        ]}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Sign In</Text>
                    </Pressable>
                </View>

                {/* Divider */}
                <View style={tw`flex-row items-center my-8`}>
                    <View style={tw`flex-1 h-[1px] bg-gray-200`} />
                    <Text style={tw`mx-4 text-gray-400`}>or</Text>
                    <View style={tw`flex-1 h-[1px] bg-gray-200`} />
                </View>

                {/* Social Logins */}
                <View style={tw`gap-4 mb-10`}>
                    <Pressable style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}>
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                        <Text style={tw`text-gray-700 font-medium`}>Sign up with Gmail</Text>
                    </Pressable>

                    <Pressable style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}>
                        <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                        <Text style={tw`text-gray-700 font-medium`}>Sign up with Facebook</Text>
                    </Pressable>

                    <Pressable style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}>
                        <Ionicons name="logo-apple" size={24} color="black" />
                        <Text style={tw`text-gray-700 font-medium`}>Sign up with Apple</Text>
                    </Pressable>
                </View>

                {/* Footer */}
                <View style={tw`flex-row justify-center pb-12`}>
                    <Text style={tw`text-gray-500`}>Don't have an account? </Text>
                    <Pressable onPress={() => router.push("/(auth)/signup")}>
                        <Text style={tw`text-[#10B981] font-bold`}>Sign Up</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

