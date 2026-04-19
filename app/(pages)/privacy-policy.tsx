import React from "react";
import { View, Text, Pressable, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function PrivacyPolicyScreen() {
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
                    <Text style={tw`text-xl font-bold text-gray-800`}>Privacy Policy</Text>
                </View>
            </View>

            <ScrollView style={tw`flex-1 px-8`} showsVerticalScrollIndicator={false}>
                <Text style={tw`text-xl font-bold text-gray-800 mb-6`}>Privacy Policy for Ride share</Text>

                <Text style={tw`text-base text-gray-500 leading-6 mb-6`}>
                    At Rideshare, accessible from rideshare.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by rideshare and how we use it.
                </Text>

                <Text style={tw`text-base text-gray-500 leading-6 mb-6`}>
                    If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                </Text>

                <Text style={tw`text-base text-gray-500 leading-6 mb-6`}>
                    This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in rideshare. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the Free Privacy Policy Generator.
                </Text>

                <View style={tw`h-10`} />
            </ScrollView>
        </SafeAreaView>
    );
}
