import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function ProfileEditScreen() {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`px-6 pt-2 flex-row items-center justify-between`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg text-gray-800 ml-1`}>Back</Text>
                </Pressable>
                <Text style={tw`text-xl font-bold text-gray-800 mr-10`}>Profile</Text>
                <View style={tw`w-10`} />
            </View>

            <ScrollView style={tw`flex-1 px-8 pt-8`} showsVerticalScrollIndicator={false}>
                {/* Profile Picture */}
                <View style={tw`items-center mb-10`}>
                    <View style={tw`relative`}>
                        <View style={tw`w-32 h-32 bg-gray-200 rounded-full items-center justify-center`}>
                            <Ionicons name="person" size={60} color="#ccc" />
                        </View>
                        <Pressable style={tw`absolute bottom-0 right-0 bg-[#10B981] p-2 rounded-full border-4 border-white`}>
                            <Ionicons name="camera" size={20} color="white" />
                        </Pressable>
                    </View>
                </View>

                <View style={tw`gap-5 pb-10`}>
                    {/* Full Name */}
                    <TextInput
                        placeholder="Full Name"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
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

                    {/* Email */}
                    <TextInput
                        placeholder="Email"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                        keyboardType="email-address"
                    />

                    {/* Street */}
                    <TextInput
                        placeholder="Street"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                    />

                    {/* City Selection */}
                    <Pressable style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white`}>
                        <Text style={tw`text-base text-gray-300`}>City</Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                    </Pressable>

                    {/* District Selection */}
                    <Pressable style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white`}>
                        <Text style={tw`text-base text-gray-300`}>District</Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                    </Pressable>

                    {/* Buttons */}
                    <View style={tw`flex-row gap-4 mt-6`}>
                        <Pressable
                            onPress={() => router.back()}
                            style={({ pressed }) => [
                                tw`flex-1 border border-[#10B981] py-4 rounded-xl items-center`,
                                pressed && tw`bg-gray-50`
                            ]}
                        >
                            <Text style={tw`text-[#10B981] font-bold text-lg`}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => router.push("/(tabs)")}
                            style={({ pressed }) => [
                                tw`flex-1 bg-[#10B981] py-4 rounded-xl items-center`,
                                pressed && tw`opacity-90`
                            ]}
                        >
                            <Text style={tw`text-white font-bold text-lg`}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
