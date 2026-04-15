import React from "react";
import { View, Text, Pressable, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function NotificationScreen() {
    const notifications = [
        {
            id: '1',
            title: 'Payment confirm',
            description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
            time: '15 min ago.',
            isUnread: true,
            section: 'Today'
        },
        {
            id: '2',
            title: 'Payment confirm',
            description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
            time: '25 min ago.',
            isUnread: false,
            section: 'Today'
        },
        {
            id: '3',
            title: 'Payment confirm',
            description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
            time: '15 min ago.',
            isUnread: true,
            section: 'Yesterday'
        },
        {
            id: '4',
            title: 'Payment confirm',
            description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
            time: '25 min ago.',
            isUnread: false,
            section: 'Yesterday'
        },
        {
            id: '5',
            title: 'Payment confirm',
            description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
            time: '25 min ago.',
            isUnread: false,
            section: 'Yesterday'
        },
        {
            id: '6',
            title: 'Payment confirm',
            description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
            time: '15 min ago.',
            isUnread: true,
            section: 'Yesterday'
        }
    ];

    const todayNotifs = notifications.filter(n => n.section === 'Today');
    const yesterdayNotifs = notifications.filter(n => n.section === 'Yesterday');

    const NotificationItem = ({ item }: { item: typeof notifications[0] }) => (
        <View style={[
            tw`p-4 rounded-xl mb-3`,
            item.isUnread ? tw`bg-[#E1F3ED]` : tw`bg-white border border-gray-50`
        ]}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{item.title}</Text>
            <Text style={tw`text-sm text-gray-400 mb-2 leading-5`}>{item.description}</Text>
            <Text style={tw`text-xs text-gray-400`}>{item.time}</Text>
        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`px-6 pt-2 flex-row items-center justify-between mb-8`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg text-gray-800 ml-1`}>Back</Text>
                </Pressable>
                <Text style={tw`text-xl font-bold text-gray-800 mr-10`}>Notification</Text>
                <View style={tw`w-10`} />
            </View>

            <ScrollView style={tw`flex-1 px-6`} showsVerticalScrollIndicator={false}>
                {/* Today Section */}
                <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Today</Text>
                {todayNotifs.map(item => <NotificationItem key={item.id} item={item} />)}

                {/* Yesterday Section */}
                <Text style={tw`text-lg font-bold text-gray-800 mt-6 mb-4`}>Yesterday</Text>
                {yesterdayNotifs.map(item => <NotificationItem key={item.id} item={item} />)}

                <View style={tw`h-10`} />
            </ScrollView>
        </SafeAreaView>
    );
}
