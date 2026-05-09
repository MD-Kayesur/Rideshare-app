import React from "react";
import { View, Text, Pressable, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGetMyNotificationsQuery } from "../../redux/features/notification/notificationApi";
import tw from 'twrnc';

export default function NotificationScreen() {
    const { data: notificationData, isLoading } = useGetMyNotificationsQuery();

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " min ago";
        return Math.floor(seconds) + " seconds ago";
    };

    // Filter for payment notifications only as requested
    const filteredNotifications = notificationData?.data?.filter((n: any) => n.type === 'payment') || [];

    const isToday = (date: string) => {
        const d = new Date(date);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    };

    const todayNotifications = filteredNotifications.filter((n: any) => isToday(n.createdAt));
    const earlierNotifications = filteredNotifications.filter((n: any) => !isToday(n.createdAt));

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

            {isLoading ? (
                <View style={tw`flex-1 items-center justify-center`}>
                    <ActivityIndicator size="large" color="#10B981" />
                </View>
            ) : (
                <ScrollView style={tw`flex-1 px-8`} showsVerticalScrollIndicator={false}>
                    {todayNotifications.length > 0 && (
                        <>
                            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Today</Text>
                            {todayNotifications.map((item: any) => (
                                <View key={item._id} style={[tw`p-4 rounded-2xl mb-3`, !item.isRead ? tw`bg-[#E1F3ED]` : tw`bg-white border border-gray-100`]}>
                                    <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{item.title}</Text>
                                    <Text style={tw`text-sm text-gray-400 mb-2 leading-5`}>{item.message}</Text>
                                    <Text style={tw`text-xs text-gray-400`}>{timeAgo(item.createdAt)}</Text>
                                </View>
                            ))}
                        </>
                    )}

                    {earlierNotifications.length > 0 && (
                        <>
                            <Text style={tw`text-lg font-bold text-gray-800 mt-6 mb-4`}>Earlier</Text>
                            {earlierNotifications.map((item: any) => (
                                <View key={item._id} style={[tw`p-4 rounded-2xl mb-3`, !item.isRead ? tw`bg-[#E1F3ED]` : tw`bg-white border border-gray-100`]}>
                                    <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{item.title}</Text>
                                    <Text style={tw`text-sm text-gray-400 mb-2 leading-5`}>{item.message}</Text>
                                    <Text style={tw`text-xs text-gray-400`}>{timeAgo(item.createdAt)}</Text>
                                </View>
                            ))}
                        </>
                    )}

                    {filteredNotifications.length === 0 && (
                        <View style={tw`mt-20 items-center`}>
                            <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
                            <Text style={tw`mt-4 text-gray-400 text-lg font-medium`}>No payment notifications yet</Text>
                        </View>
                    )}
                    
                    <View style={tw`h-10`} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
