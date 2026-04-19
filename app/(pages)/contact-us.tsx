import React from "react";
import { View, Text, Pressable, ScrollView, StatusBar, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function ContactUsScreen() {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`px-8 pt-6 flex-row items-center mb-8`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg font-medium text-gray-800 ml-1`}>Back</Text>
                </Pressable>
                <View style={tw`flex-1 items-center mr-10`}>
                    <Text style={tw`text-xl font-bold text-gray-800`}>Contact Us</Text>
                </View>
            </View>

            <ScrollView style={tw`flex-1 px-8`} showsVerticalScrollIndicator={false}>
                <View style={tw`items-center mb-8`}>
                    <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Contact us for Ride share</Text>

                    <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>Address</Text>
                    <Text style={tw`text-sm text-gray-500 text-center leading-5 mb-4`}>
                        House# 72, Road# 21, Banani, Dhaka-1213 (near Banani Bidyaniketon School & College, beside University of South Asia)
                    </Text>

                    <Text style={tw`text-sm text-gray-500`}>Call : 13301 (24/7)</Text>
                    <Text style={tw`text-sm text-gray-500`}>Email : support@pathao.com</Text>
                </View>

                <Text style={tw`text-lg font-bold text-gray-800 mb-6 text-center`}>Send Message</Text>

                {/* Inputs */}
                <TextInput
                    placeholder="Name"
                    style={tw`border border-gray-200 rounded-xl p-4 mb-4 text-base`}
                />
                <TextInput
                    placeholder="Email"
                    style={tw`border border-gray-200 rounded-xl p-4 mb-4 text-base`}
                    keyboardType="email-address"
                />

                <View style={tw`flex-row border border-gray-200 rounded-xl mb-4 overflow-hidden`}>
                    <View style={tw`flex-row items-center px-4 bg-gray-50 border-r border-gray-200`}>
                        <Text style={tw`text-xl mr-1`}>🇧🇩</Text>
                        <Ionicons name="chevron-down" size={16} color="#666" />
                    </View>
                    <TextInput
                        placeholder="Your mobile number"
                        style={tw`flex-1 p-4 text-base`}
                        keyboardType="phone-pad"
                    />
                </View>

                <TextInput
                    placeholder="Write your text"
                    style={[tw`border border-gray-200 rounded-xl p-4 mb-8 text-base`, { height: 120, textAlignVertical: 'top' }]}
                    multiline
                />

                <Pressable
                    onPress={() => router.back()}
                    style={tw`bg-[#10B981] py-4 rounded-xl items-center mb-8`}
                >
                    <Text style={tw`text-white text-lg font-bold`}>Send Message</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
