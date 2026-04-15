import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';
import React, { useState } from "react";

export default function SignUpScreen() {
    const [agreed, setAgreed] = useState(false);

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
                    Sign up with your email or phone number
                </Text>

                <View style={tw`gap-5 pb-8`}>
                    {/* Name Input */}
                    <TextInput
                        placeholder="Name"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                    />

                    {/* Email Input */}
                    <TextInput
                        placeholder="Email"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                        keyboardType="email-address"
                    />

                    {/* Phone Input with Country Code */}
                    <View style={tw`flex-row items-center border border-gray-200 rounded-xl bg-white`}>
                        <Pressable style={tw`flex-row items-center px-4 py-4 border-r border-gray-200`}>
                            <Text style={tw`text-2xl mr-2`}>🇧🇩</Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </Pressable>
                        <View style={tw`flex-row items-center flex-1 px-4`}>
                            <Text style={tw`text-base text-gray-800 mr-2`}>+880</Text>
                            <TextInput
                                placeholder="Your mobile number"
                                style={tw`flex-1 py-4 text-base`}
                                placeholderTextColor="#ccc"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Gender Selection */}
                    <Pressable style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white`}>
                        <Text style={tw`text-base text-gray-300`}>Gender</Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                    </Pressable>

                    {/* Terms and Privacy */}
                    <View style={tw`flex-row items-center`}>
                        <Pressable
                            onPress={() => setAgreed(!agreed)}
                            style={tw`w-6 h-6 rounded-full border-2 ${agreed ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-300'} items-center justify-center mr-3`}
                        >
                            {agreed && <Ionicons name="checkmark" size={16} color="white" />}
                        </Pressable>
                        <Text style={tw`flex-1 text-sm text-gray-400`}>
                            By signing up, you agree to the <Text style={tw`text-[#10B981]`}>Terms of service</Text> and <Text style={tw`text-[#10B981]`}>Privacy policy</Text>.
                        </Text>
                    </View>

                    {/* Sign Up Button */}
                    <Pressable
                        onPress={() => router.push("/(auth)/verify")}
                        style={({ pressed }) => [
                            tw`bg-[#10B981] py-4 rounded-xl items-center mt-4`,
                            pressed && tw`opacity-90`
                        ]}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Sign Up</Text>
                    </Pressable>
                </View>

                {/* Divider */}
                <View style={tw`flex-row items-center mb-8`}>
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
                    <Text style={tw`text-gray-500`}>Already have an account? </Text>
                    <Pressable onPress={() => router.push("/(auth)/login")}>
                        <Text style={tw`text-[#10B981] font-bold`}>Sign in</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
