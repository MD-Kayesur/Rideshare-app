import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
    const [mode, setMode] = useState<'transport' | 'delivery'>('transport');

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Map Placeholder Background */}
            <View style={tw`absolute inset-0 bg-gray-100`}>
                <Image
                    source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1/600x1200?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2p4eHgxZngxZngxZngxZngxZngxZngxIn0.example' }}
                    style={tw`w-full h-full opacity-50`}
                    resizeMode="cover"
                />

                {/* Central Ripple Pin */}
                <View style={tw`absolute inset-0 items-center justify-center`}>
                    <View style={tw`w-40 h-40 rounded-full bg-[#10B981]/10 items-center justify-center`}>
                        <View style={tw`w-20 h-20 rounded-full bg-[#10B981]/20 items-center justify-center`}>
                            <View style={tw`w-8 h-8 rounded-full bg-[#10B981]/30 items-center justify-center`}>
                                <Ionicons name="location" size={24} color="#1F2937" />
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <SafeAreaView style={tw`flex-1 px-4 pt-4`}>
                {/* Top Bar */}
                <View style={tw`flex-row justify-between items-center mb-6`}>
                    <Pressable style={tw`w-12 h-12 bg-[#10B981]/10 rounded-lg items-center justify-center`}>
                        <Ionicons name="menu" size={28} color="#10B981" />
                    </Pressable>
                    <Pressable style={tw`w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm`}>
                        <Ionicons name="notifications-outline" size={24} color="#1F2937" />
                    </Pressable>
                </View>

                {/* Rental Button */}
                <View style={tw`absolute left-4 top-1/2 -mt-24`}>
                    <Pressable style={tw`bg-[#065F46] py-4 px-8 rounded-xl shadow-lg`}>
                        <Text style={tw`text-white font-bold text-lg`}>Rental</Text>
                    </Pressable>
                </View>

                {/* Search and Toggle Container */}
                <View style={tw`mt-auto mb-30 bg-[#10B981]/20 p-4 rounded-2xl border border-[#10B981]/30`}>
                    {/* Search Bar */}
                    <View style={tw`flex-row items-center bg-white rounded-xl px-4 py-4 mb-4 shadow-sm`}>
                        <Ionicons name="search" size={24} color="#9CA3AF" style={tw`mr-3`} />
                        <TextInput
                            placeholder="Where would you go?"
                            style={tw`flex-1 text-base text-gray-800`}
                            placeholderTextColor="#9CA3AF"
                        />
                        <Ionicons name="heart-outline" size={24} color="#D1D5DB" />
                    </View>

                    {/* Transport/Delivery Toggle */}
                    <View style={tw`flex-row bg-[#F3F4F6] rounded-xl p-1`}>
                        <Pressable
                            onPress={() => setMode('transport')}
                            style={tw`flex-1 py-4 rounded-lg items-center ${mode === 'transport' ? 'bg-[#10B981]' : ''}`}
                        >
                            <Text style={tw`font-bold text-lg ${mode === 'transport' ? 'text-white' : 'text-gray-500'}`}>Transport</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setMode('delivery')}
                            style={tw`flex-1 py-4 rounded-lg items-center ${mode === 'delivery' ? 'bg-[#10B981]' : ''}`}
                        >
                            <Text style={tw`font-bold text-lg ${mode === 'delivery' ? 'text-white' : 'text-gray-500'}`}>Delivery</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Focus Button */}
                <View style={tw`absolute right-4 bottom-1/2 -mb-28`}>
                    <Pressable style={tw`w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-100`}>
                        <MaterialCommunityIcons name="target" size={28} color="#1F2937" />
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}
