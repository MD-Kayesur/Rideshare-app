import React from "react";
import { View, Text, Pressable, ScrollView, StatusBar, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function NotificationScreen() {
    const notifications = [
        { id: '1', title: 'Payment confirm', description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae', time: '15 min ago.', isUnread: true, section: 'Today' },
        { id: '2', title: 'Payment confirm', description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae', time: '25 min ago.', isUnread: false, section: 'Today' },
        { id: '3', title: 'Payment confirm', description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae', time: '15 min ago.', isUnread: true, section: 'Yesterday' },
        { id: '4', title: 'Payment confirm', description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae', time: '25 min ago.', isUnread: false, section: 'Yesterday' },
        { id: '5', title: 'Payment confirm', description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae', time: '25 min ago.', isUnread: false, section: 'Yesterday' },
        { id: '6', title: 'Payment confirm', description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae', time: '15 min ago.', isUnread: true, section: 'Yesterday' },
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
                    <Text style={tw`text-xl font-bold text-gray-800`}>Notification</Text>
                </View>
            </View>

            <ScrollView style={tw`flex-1 px-8`} showsVerticalScrollIndicator={false}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Today</Text>
                {notifications.filter(n => n.section === 'Today').map(item => (
                    <View key={item.id} style={[tw`p-4 rounded-2xl mb-3`, item.isUnread ? tw`bg-[#E1F3ED]` : tw`bg-white border border-gray-100`]}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{item.title}</Text>
                        <Text style={tw`text-sm text-gray-400 mb-2 leading-5`}>{item.description}</Text>
                        <Text style={tw`text-xs text-gray-400`}>{item.time}</Text>
                    </View>
                ))}

                <Text style={tw`text-lg font-bold text-gray-800 mt-6 mb-4`}>Yesterday</Text>
                {notifications.filter(n => n.section === 'Yesterday').map(item => (
                    <View key={item.id} style={[tw`p-4 rounded-2xl mb-3`, item.isUnread ? tw`bg-[#E1F3ED]` : tw`bg-white border border-gray-100`]}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{item.title}</Text>
                        <Text style={tw`text-sm text-gray-400 mb-2 leading-5`}>{item.description}</Text>
                        <Text style={tw`text-xs text-gray-400`}>{item.time}</Text>
                    </View>
                ))}
                <View style={tw`h-10`} />
            </ScrollView>
        </SafeAreaView>
    );
}
