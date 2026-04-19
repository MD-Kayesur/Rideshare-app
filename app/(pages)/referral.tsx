import React from "react";
import { View, Text, Pressable, StatusBar, Share, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Clipboard from 'expo-clipboard';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function ReferralScreen() {
    const referralCode = "RkMFucd";

    const handleCopy = async () => {
        await Clipboard.setStringAsync(referralCode);
        Alert.alert("Success", "Referral code copied to clipboard!");
    };

    const handleInvite = async () => {
        try {
            await Share.share({
                message: `Join me on this awesome rideshare app! Use my referral code: ${referralCode}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

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
                    <Text style={tw`text-xl font-bold text-gray-800`}>Referral</Text>
                </View>
            </View>

            <View style={tw`px-8 flex-1`}>
                <Text style={tw`text-lg text-gray-600 mb-4`}>Refer a friend and Earn $20</Text>

                {/* Referral Code Box */}
                <View style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl p-4 mb-10`}>
                    <Text style={tw`text-xl font-medium text-gray-800`}>{referralCode}</Text>
                    <Pressable onPress={handleCopy}>
                        <MaterialCommunityIcons name="content-copy" size={24} color="#6B7280" />
                    </Pressable>
                </View>

                {/* Invite Button */}
                <Pressable
                    onPress={handleInvite}
                    style={tw`bg-[#008B5E] py-4 rounded-xl items-center`}
                >
                    <Text style={tw`text-white text-lg font-bold`}>Invite</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
