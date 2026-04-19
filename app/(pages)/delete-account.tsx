import React from "react";
import { View, Text, Pressable, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function DeleteAccountScreen() {
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
                    <Text style={tw`text-xl font-bold text-gray-800`}>Delete Account</Text>
                </View>
            </View>

            <View style={tw`flex-1 px-8 pt-10`}>
                <Text style={tw`text-lg text-gray-500 leading-7 mb-10`}>
                    Are you sure you want to delete your account? Please read how account deletion will affect.{"\n\n"}
                    Deleting your account removes personal information our database. Your email becomes permanently reserved and same email cannot be re-use to register a new account.
                </Text>

                <Pressable
                    onPress={() => {
                        Alert.alert("Success", "Account deleted successfully");
                        router.replace("/(auth)/login");
                    }}
                    style={tw`bg-[#F87171] py-4 rounded-xl items-center`}
                >
                    <Text style={tw`text-white text-lg font-bold`}>Delete</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
