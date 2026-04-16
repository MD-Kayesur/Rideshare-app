import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Image, Dimensions, DeviceEventEmitter } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
    const [mode, setMode] = useState<'transport' | 'delivery'>('transport');
    const [flowState, setFlowState] = useState<'none' | 'selecting' | 'confirming'>('none');
    const [locations, setLocations] = useState({ from: '', to: '' });

    const toggleSidebar = (open: boolean) => {
        DeviceEventEmitter.emit('toggleSidebar', open);
    };

    const recentPlaces = [
        { id: '1', name: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', distance: '2.7km' },
        { id: '2', name: 'Coffee shop', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', distance: '1.1km' },
        { id: '3', name: 'Shopping center', address: '4140 Parker Rd. Allentown, New Mexico 31134', distance: '4.9km' },
        { id: '4', name: 'Shopping mall', address: '4140 Parker Rd. Allentown, New Mexico 31134', distance: '4.0km' }
    ];

    const renderBottomSheet = () => {
        if (flowState === 'none') return null;

        return (
            <View style={[tw`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40`, { height: flowState === 'selecting' ? '65%' : '50%' }]}>
                {/* Drag Handle */}
                <View style={tw`items-center py-4`}>
                    <View style={tw`w-16 h-1.5 bg-gray-200 rounded-full`} />
                </View>

                {/* Close Button */}
                <Pressable
                    onPress={() => setFlowState('none')}
                    style={tw`absolute right-6 top-6 z-10`}
                >
                    <Ionicons name="close" size={24} color="#333" />
                </Pressable>

                <View style={tw`px-6 flex-1`}>
                    <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-6`}>Select address</Text>

                    {flowState === 'selecting' && (
                        <View style={tw`flex-1 pb-10`}>
                            {/* Input Fields */}
                            <View style={tw`gap-4 mb-6`}>
                                <View style={tw`flex-row items-center border border-[#10B981] rounded-xl px-4 py-4 bg-white`}>
                                    <Ionicons name="locate-outline" size={24} color="#10B981" style={tw`mr-3`} />
                                    <TextInput
                                        placeholder="Current location"
                                        style={tw`flex-1 text-base text-gray-800`}
                                        placeholderTextColor="#9CA3AF"
                                        defaultValue="Current location"
                                    />
                                    <Ionicons name="locate" size={24} color="#EF4444" />
                                </View>
                                <View style={tw`flex-row items-center border border-gray-200 rounded-xl px-4 py-4 bg-white`}>
                                    <Ionicons name="location-outline" size={24} color="#9CA3AF" style={tw`mr-3`} />
                                    <TextInput
                                        placeholder="United state"
                                        style={tw`flex-1 text-base text-gray-800`}
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={(v) => setLocations(l => ({ ...l, to: v }))}
                                    />
                                </View>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Recent places</Text>
                                {recentPlaces.map(place => (
                                    <Pressable
                                        key={place.id}
                                        onPress={() => {
                                            setLocations(prev => ({ ...prev, to: place.name }));
                                            setFlowState('confirming');
                                        }}
                                        style={tw`flex-row items-start mb-6`}
                                    >
                                        <View style={tw`w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4`}>
                                            <Ionicons name="location" size={20} color="#6B7280" />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex-row justify-between items-center mb-1`}>
                                                <Text style={tw`text-lg font-bold text-gray-800`}>{place.name}</Text>
                                                <Text style={tw`text-gray-400 font-medium`}>{place.distance}</Text>
                                            </View>
                                            <Text style={tw`text-gray-400 text-sm leading-5`}>{place.address}</Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {flowState === 'confirming' && (
                        <View style={tw`flex-1 pb-24`}>
                            <View style={tw`bg-gray-50 rounded-2xl p-6 mb-8`}>
                                <View style={tw`flex-row items-start mb-6`}>
                                    <View style={tw`items-center mr-4`}>
                                        <Ionicons name="location" size={24} color="#EF4444" />
                                        <View style={tw`w-0.5 h-10 border-l border-dashed border-[#10B981] my-1`} />
                                    </View>
                                    <View>
                                        <Text style={tw`text-lg font-bold text-gray-800`}>Current location</Text>
                                        <Text style={tw`text-gray-400 text-sm`}>2972 Westheimer Rd. Santa Ana, Illinois 85486</Text>
                                    </View>
                                </View>
                                <View style={tw`flex-row items-start`}>
                                    <View style={tw`items-center mr-4`}>
                                        <Ionicons name="location" size={24} color="#10B981" />
                                    </View>
                                    <View>
                                        <Text style={tw`text-lg font-bold text-gray-800`}>{locations.to}</Text>
                                        <Text style={tw`text-gray-400 text-sm`}>1901 Thornridge Cir. Shiloh, Hawaii 81063</Text>
                                    </View>
                                    <Text style={tw`ml-auto text-gray-400 font-medium`}>1.1km</Text>
                                </View>
                            </View>

                            <Pressable
                                onPress={() => router.push("/(pages)/select-transport")}
                                style={tw`bg-[#10B981] py-4 rounded-xl items-center shadow-lg w-full`}
                            >
                                <Text style={tw`text-white font-bold text-lg`}>Confirm Location</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Map Background */}
            <View style={tw`absolute inset-0 bg-gray-100`}>
                <Image
                    source={require('../../assets/images/map_background.png')}
                    style={tw`w-full h-full opacity-60`}
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
                    <Pressable
                        onPress={() => toggleSidebar(true)}
                        style={tw`w-12 h-12 bg-[#10B981]/10 rounded-lg items-center justify-center`}
                    >
                        <Ionicons name="menu" size={28} color="#10B981" />
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/(pages)/notifications")}
                        style={tw`w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm`}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#1F2937" />
                    </Pressable>
                </View>

                {/* Rental Button */}
                <View style={tw`absolute left-4 top-1/2 -mt-24`}>
                    <Pressable
                        onPress={() => setFlowState('selecting')}
                        style={tw`bg-[#065F46] py-4 px-8 rounded-xl shadow-lg`}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Rental</Text>
                    </Pressable>
                </View>

                {/* Search and Toggle Container - Visible only when NOT selecting */}
                {flowState === 'none' && (
                    <View style={tw`mt-auto mb-30 bg-[#10B981]/20 p-4 rounded-2xl border border-[#10B981]/30`}>
                        {/* Search Bar */}
                        <Pressable
                            onPress={() => setFlowState('selecting')}
                            style={tw`flex-row items-center bg-white rounded-xl px-4 py-4 mb-4 shadow-sm`}
                        >
                            <Ionicons name="search" size={24} color="#9CA3AF" style={tw`mr-3`} />
                            <Text style={tw`flex-1 text-base text-gray-400`}>Where would you go?</Text>
                            <Ionicons name="heart-outline" size={24} color="#D1D5DB" />
                        </Pressable>

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
                )}

                {/* Focus Button */}
                <View style={tw`absolute right-4 bottom-1/2 -mb-28`}>
                    <Pressable style={tw`w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-100`}>
                        <MaterialCommunityIcons name="target" size={28} color="#1F2937" />
                    </Pressable>
                </View>
            </SafeAreaView>

            {/* Address Selection Bottom Sheet */}
            {renderBottomSheet()}
        </View>
    );
}
