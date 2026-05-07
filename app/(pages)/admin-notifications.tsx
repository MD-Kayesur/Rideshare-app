import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useGetAllNotificationsQuery, useMarkAsReadMutation, useDeleteNotificationMutation, useDeleteAllNotificationsMutation } from '../../redux/features/notification/notificationApi';
import { useCreateChatMutation } from '../../redux/features/chat/chatApi';
import { socketService } from '../../utils/socket';

export default function AdminNotificationsScreen() {
    const { data: notifications, refetch: refetchNotifications } = useGetAllNotificationsQuery();
    const [markAsRead] = useMarkAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
    const [createChat] = useCreateChatMutation();
    
    const unreadCount = notifications?.data?.filter((n: any) => !n.isRead).length || 0;

    useEffect(() => {
        const socket = socketService.connect();
        socket.on('admin-notification', () => {
            refetchNotifications();
        });
        return () => {
            socket.off('admin-notification');
        };
    }, []);

    const handleNotificationClick = async (notif: any) => {
        try {
            await markAsRead(notif._id).unwrap();
            
            if (notif.type === 'complaint' && notif.metadata?.userId) {
                // Open chat with the user who complained
                const chatRes = await createChat({ participants: [notif.metadata.userId] }).unwrap();
                const chatId = chatRes.data?._id || chatRes.data?.id;
                
                router.push({
                    pathname: '/(pages)/chat',
                    params: {
                        chatId,
                        userName: "User", // We could fetch actual name if needed
                    }
                });
            } else if (notif.type === 'driver_request') {
                // Redirect to a details page (placeholder for now)
                Alert.alert("Detail View", "This would redirect to driver verification details.");
            }
        } catch (err) {}
    };

    const handleDeleteSingle = (id: string) => {
        Alert.alert(
            "Delete Notification",
            "Are you sure you want to delete this notification?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteNotification(id).unwrap();
                        } catch (err) {
                            Alert.alert("Error", "Failed to delete notification");
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAll = () => {
        if (!notifications?.data?.length) return;
        
        Alert.alert(
            "Delete All",
            "Are you sure you want to delete all notifications?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete All", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAllNotifications().unwrap();
                        } catch (err) {
                            Alert.alert("Error", "Failed to delete all notifications");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={tw`flex-1 bg-[#F9FAFB]`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                <View style={tw`px-6 py-4 flex-row items-center bg-white border-b border-gray-50`}>
                    <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </Pressable>
                    <Text style={tw`text-2xl font-bold text-gray-800 ml-2 flex-1`}>Notifications</Text>
                    
                    {notifications?.data?.length > 0 && (
                        <Pressable onPress={handleDeleteAll} style={tw`p-2`}>
                            <Ionicons name="trash-outline" size={24} color="#EF4444" />
                        </Pressable>
                    )}

                    {unreadCount > 0 && (
                        <View style={tw`ml-3 bg-[#10B981] px-2.5 py-1 rounded-full`}>
                            <Text style={tw`text-white text-xs font-bold`}>{unreadCount}</Text>
                        </View>
                    )}
                </View>

                <ScrollView style={tw`flex-1 px-6 pt-4`} showsVerticalScrollIndicator={false}>
                    {!notifications?.data?.length ? (
                        <View style={tw`mt-20 items-center`}>
                            <Ionicons name="notifications-off-outline" size={80} color="#D1D5DB" />
                            <Text style={tw`text-gray-400 font-medium mt-4 text-lg`}>No notifications yet</Text>
                        </View>
                    ) : (
                        notifications?.data?.map((notif: any) => (
                            <View key={notif._id} style={tw`mb-4`}>
                                <Pressable 
                                    onPress={() => handleNotificationClick(notif)}
                                    style={tw`rounded-3xl p-5 shadow-sm border ${notif.isRead ? 'bg-white border-gray-100' : 'bg-green-50 border-green-200'}`}
                                >
                                    <View style={tw`flex-row items-start`}>
                                        <View style={tw`w-10 h-10 rounded-full ${
                                            notif.type === 'complaint' ? 'bg-red-100' : 
                                            notif.type === 'chat' ? 'bg-green-100' : 'bg-blue-100'
                                        } items-center justify-center`}>
                                            <Ionicons 
                                                name={
                                                    notif.type === 'complaint' ? "alert-circle" : 
                                                    notif.type === 'chat' ? "chatbubbles" : "notifications"
                                                } 
                                                size={24} 
                                                color={
                                                    notif.type === 'complaint' ? "#EF4444" : 
                                                    notif.type === 'chat' ? "#10B981" : "#3B82F6"
                                                } 
                                            />
                                        </View>
                                        <View style={tw`ml-2 flex-1`}>
                                            <View style={tw`flex-row justify-between items-center mb-1`}>
                                                <View style={tw`flex-row items-center`}>
                                                    <Text style={tw`font-bold text-gray-800 text-base`}>{notif.title.slice(0,18)}....</Text>
                                                    {!notif.isRead && (
                                                        <View style={tw`ml-2 bg-[#10B981] px-1.5 py-0.5 rounded-md`}>
                                                            <Text style={tw`text-white text-[8px] font-bold`}>NEW</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <View style={tw`flex-row  items-center`}>
                                                    <Text style={tw`text-[10px] text-gray-400 mr-2`}>
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>


                                                    <Pressable 
                                                    style={tw``} onPress={() => handleDeleteSingle(notif._id)}>
                                                        <Ionicons name="trash-outline" size={20} color="#fc2c02ff" />
                                                    </Pressable>
                                                </View>
                                            </View>
                                            <Text style={tw`text-gray-500 text-sm leading-5`}>{notif.message.slice(0,35)}....</Text>
                                            {notif.isRead && (
                                                <View style={tw`flex-row items-center mt-2`}>
                                                    <Ionicons name="checkmark-done" size={14} color="#9CA3AF" />
                                                    <Text style={tw`text-[10px] text-gray-400 ml-1`}>Read</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        ))
                    )}
                    <View style={tw`h-10`} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
