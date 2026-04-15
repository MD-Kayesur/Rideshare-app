import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import tw from 'twrnc';

type Tab = 'Upcoming' | 'Completed' | 'Cancelled';

const HistoryPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Upcoming');

    const historyData = {
        Upcoming: [
            { id: '1', name: 'Nate', car: 'Mustang Shelby GT', time: 'Today at 09:20 am' },
            { id: '2', name: 'Henry', car: 'Mustang Shelby GT', time: 'Today at 10:20 am' },
            { id: '3', name: 'Willam', car: 'Mustang Shelby GT', time: 'Tomorrow at 09:20 am' },
            { id: '4', name: 'Nate', car: 'Mustang Shelby GT', time: 'Today at 09:20 am' },
            { id: '5', name: 'Henry', car: 'Mustang Shelby GT', time: 'Today at 10:20 am' },
            { id: '6', name: 'Willam', car: 'Mustang Shelby GT', time: 'Tomorrow at 09:20 am' },
            { id: '7', name: 'Henry', car: 'Mustang Shelby GT', time: 'Today at 10:20 am' },
            { id: '8', name: 'Willam', car: 'Mustang Shelby GT', time: 'Tomorrow at 09:20 am' },
        ],
        Completed: [
            { id: '1', name: 'Nate', car: 'Mustang Shelby GT', status: 'Done' },
            { id: '2', name: 'Henry', car: 'Mustang Shelby GT', status: 'Done' },
            { id: '3', name: 'Willam', car: 'Mustang Shelby GT', status: 'Done' },
            { id: '4', name: 'Nate', car: 'Mustang Shelby GT', status: 'Done' },
            { id: '5', name: 'Henry', car: 'Mustang Shelby GT', status: 'Done' },
            { id: '6', name: 'Willam', car: 'Mustang Shelby GT', status: 'Done' },
            { id: '7', name: 'Henry', car: 'Mustang Shelby GT', status: 'Done' },
            { id: '8', name: 'Willam', car: 'Mustang Shelby GT', status: 'Done' },
        ],
        Cancelled: [
            { id: '1', name: 'Nate', car: 'Mustang Shelby GT', status: 'Cancel' },
            { id: '2', name: 'Henry', car: 'Mustang Shelby GT', status: 'Cancel' },
            { id: '3', name: 'Willam', car: 'Mustang Shelby GT', status: 'Cancel' },
            { id: '4', name: 'Nate', car: 'Mustang Shelby GT', status: 'Cancel' },
            { id: '5', name: 'Henry', car: 'Mustang Shelby GT', status: 'Cancel' },
            { id: '6', name: 'Willam', car: 'Mustang Shelby GT', status: 'Cancel' },
            { id: '7', name: 'Henry', car: 'Mustang Shelby GT', status: 'Cancel' },
            { id: '8', name: 'Willam', car: 'Mustang Shelby GT', status: 'Cancel' },
        ]
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View style={tw`flex-row items-center px-6 py-4`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center absolute left-6 z-10`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg font-medium text-gray-800 ml-1`}>Back</Text>
                </Pressable>
                <View style={tw`flex-1 items-center`}>
                    <Text style={tw`text-2xl font-bold text-gray-900`}>History</Text>
                </View>
            </View>

            {/* Tabs Container */}
            <View style={tw`px-6 mb-6 mt-4`}>
                <View style={tw`flex-row bg-[#E6F7F1] rounded-2xl p-1`}>
                    {(['Upcoming', 'Completed', 'Cancelled'] as Tab[]).map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={tw`flex-1 py-4 rounded-xl items-center ${activeTab === tab ? 'bg-[#10B981]' : ''}`}
                        >
                            <Text style={tw`font-semibold text-base ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}>
                                {tab}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* List */}
            <ScrollView style={tw`flex-1 px-6`} showsVerticalScrollIndicator={false}>
                {historyData[activeTab].map((item, index) => (
                    <View
                        key={`${item.id}-${index}`}
                        style={tw`flex-row justify-between items-center bg-white border border-[#10B981]/20 rounded-2xl px-5 py-6 mb-4 shadow-sm`}
                    >
                        <View>
                            <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>{item.name}</Text>
                            <Text style={tw`text-base text-gray-400`}>{item.car}</Text>
                        </View>
                        <View>
                            {activeTab === 'Upcoming' ? (
                                <Text style={tw`text-gray-500 font-medium`}>{(item as any).time}</Text>
                            ) : (
                                <Text style={tw`text-lg font-medium ${activeTab === 'Completed' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                    {(item as any).status}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HistoryPage;
