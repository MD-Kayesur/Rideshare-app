import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StatusBar, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function ChangeLanguageScreen() {
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const languages = [
        { name: 'English', flag: '🇺🇸', sub: 'English' },
        { name: 'Hindi', flag: '🇮🇳', sub: 'Hindi' },
        { name: 'Arabic', flag: '🇯🇴', sub: 'Arabic' },
        { name: 'French', flag: '🇫🇷', sub: 'French' },
        { name: 'German', flag: '🇩🇪', sub: 'German' },
        { name: 'Portuguese', flag: '🇵🇹', sub: 'Portuguese' },
        { name: 'Turkish', flag: '🇹🇷', sub: 'Turkish' },
        { name: 'Dutch', flag: '🇳🇱', sub: 'Nederlands' },
    ];

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
                    <Text style={tw`text-xl font-bold text-gray-800`}>Change Language</Text>
                </View>
            </View>

            <ScrollView style={tw`flex-1 px-8`} showsVerticalScrollIndicator={false}>
                {languages.map((lang) => (
                    <Pressable
                        key={lang.name}
                        onPress={() => setSelectedLanguage(lang.name)}
                        style={[
                            tw`flex-row items-center justify-between border rounded-xl p-4 mb-4`,
                            selectedLanguage === lang.name ? tw`border-[#10B981]` : tw`border-gray-100`
                        ]}
                    >
                        <View style={tw`flex-row items-center`}>
                            <Text style={tw`text-2xl mr-4`}>{lang.flag}</Text>
                            <View>
                                <Text style={tw`text-lg font-bold text-gray-800`}>{lang.name}</Text>
                                <Text style={tw`text-sm text-gray-400`}>{lang.sub}</Text>
                            </View>
                        </View>
                        <Ionicons
                            name={selectedLanguage === lang.name ? "checkmark-circle" : "ellipse-outline"}
                            size={24}
                            color={selectedLanguage === lang.name ? "#10B981" : "#D1D5DB"}
                        />
                    </Pressable>
                ))}
            </ScrollView>

            <View style={tw`px-8 pb-8`}>
                <Pressable
                    onPress={() => router.back()}
                    style={tw`bg-[#10B981] py-4 rounded-xl items-center`}
                >
                    <Text style={tw`text-white text-lg font-bold`}>Save</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
