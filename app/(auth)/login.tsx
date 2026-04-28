import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import React, { useState } from "react";

import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";
import { setItem } from "../../redux/hooks/storage";

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();

    const isFormValid = identifier.includes("@") && password.trim() !== "";

    const handleLogin = async () => {
        try {
            const res = await login({ email: identifier, password }).unwrap();
            console.log('Login response:', res);
            
            if (res.success && res.data) {
                const { accessToken, user } = res.data;
                
                // Save to Storage
                await setItem('accessToken', accessToken);
                await setItem('userData', JSON.stringify(user));
                
                // Save to Redux
                dispatch(setUser({ user, token: accessToken }));
                
                Alert.alert("Success", "Logged in successfully!");
                router.push("/(tabs)");
            }
        } catch (error: any) {
            console.error('Login error:', error);
            Alert.alert("Error", error?.data?.message || "Something went wrong. Please try again.");
        }
    };

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
                <Text style={[tw`font-black text-[#10B981] text-center mb-10`, { fontSize: 50 }]}>
                    Rideshare
                </Text>

                <Text style={tw`text-2xl font-bold text-gray-800 mb-8`}>
                    Sign in with your email
                </Text>

                <View style={tw`gap-5`}>
                    {/* Email/Phone Input */}
                    <TextInput
                        placeholder="Email"
                        value={identifier}
                        onChangeText={setIdentifier}
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* Password Input */}
                    <View style={tw`flex-row items-center border border-gray-200 rounded-xl bg-white px-4`}>
                        <TextInput
                            placeholder="Enter Your Password"
                            value={password}
                            onChangeText={setPassword}
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

                    {/* Login Button */}
                    <Pressable
                        onPress={handleLogin}
                        disabled={!isFormValid || isLoading}
                        style={[
                            tw`flex-row items-center justify-center border py-3 rounded-xl gap-3`,
                            isFormValid && !isLoading ? tw`border-[#10B981] bg-white` : tw`border-gray-200 bg-gray-50`
                        ]}
                    >
                        <Text style={[tw`font-bold text-lg`, isFormValid && !isLoading ? tw`text-[#10B981]` : tw`text-gray-300`]}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Text>
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
                    <Pressable
                        onPress={() => Alert.alert("Social Login", "Gmail login will be implemented soon.")}
                        style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}
                    >
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                        <Text style={tw`text-gray-700 font-medium`}>Sign up with Gmail</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => Alert.alert("Social Login", "Facebook login will be implemented soon.")}
                        style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}
                    >
                        <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                        <Text style={tw`text-gray-700 font-medium`}>Sign up with Facebook</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => Alert.alert("Social Login", "Apple login will be implemented soon.")}
                        style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}
                    >
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

