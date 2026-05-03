import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from '../../redux/features/notification/notificationApi';
import { 
    useGetPendingDriversQuery, 
    useVerifyDriverMutation,
    useGetAllComplaintsQuery, 
    useResolveComplaintMutation 
} from '../../redux/features/driver/driverApi';
import { useCreateChatMutation, useSendMessageMutation } from '../../redux/features/chat/chatApi';
import { socketService } from '../../utils/socket';

export default function AdminNotificationsScreen() {
    const [activeTab, setActiveTab] = useState<'alerts' | 'drivers' | 'complaints'>('alerts');
    
    const { data: notifications, refetch: refetchNotifications } = useGetNotificationsQuery({});
    const [markAsRead] = useMarkNotificationAsReadMutation();
    
    const { data: pendingDrivers } = useGetPendingDriversQuery({});
    const { data: complaints } = useGetAllComplaintsQuery({});
    
    const [verifyDriver, { isLoading: isVerifying }] = useVerifyDriverMutation();
    const [resolveComplaint, { isLoading: isResolving }] = useResolveComplaintMutation();

    const unreadCount = notifications?.data?.filter((n: any) => !n.isRead).length || 0;

    useEffect(() => {
        const socket = socketService.connect();
        socket.on('admin_notification', () => {
            refetchNotifications();
        });
        return () => {
            socket.off('admin_notification');
        };
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await markAsRead(id).unwrap();
        } catch (err) {}
    };

    const handleVerify = async (id: string) => {
        try {
            await verifyDriver(id).unwrap();
            Alert.alert("Success", "Driver approved!");
        } catch (err: any) {
            Alert.alert("Error", err?.data?.message || "Verification failed");
        }
    };

    const [createChat] = useCreateChatMutation();
    const [sendMessage] = useSendMessageMutation();

    const handleResolve = async (comp: any) => {
        try {
            // 1. Resolve the complaint
            await resolveComplaint(comp._id).unwrap();
            
            // 2. Create or get chat with the user who complained
            const chatRes = await createChat({ participants: [comp.user?._id] }).unwrap();
            const chatId = chatRes.data?._id || chatRes.data?.id;

            // 3. Send initial message from admin
            await sendMessage({ 
                chatId, 
                content: `Hi ${comp.user?.name}, I have reviewed and resolved your complaint regarding "${comp.subject}". How can I help you further?` 
            }).unwrap();
            
            Alert.alert("Success", "Complaint resolved and follow-up message sent!");
            
            // 4. Redirect to chat box
            router.push({
                pathname: '/(pages)/chat',
                params: {
                    chatId,
                    userName: comp.user?.name,
                    userAvatar: comp.user?.avatar
                }
            });
        } catch (err: any) {
            Alert.alert("Error", err?.data?.message || "Resolution failed");
        }
    };

    const driverComplaints = complaints?.data?.filter((c: any) => c.user?.role === 'driver') || [];
    const riderComplaints = complaints?.data?.filter((c: any) => c.user?.role === 'rider') || [];

    const renderAlerts = () => (
        <ScrollView style={tw`flex-1 px-6 pt-4`}>
            {!notifications?.data?.length ? (
                <View style={tw`mt-10 items-center`}>
                    <Ionicons name="notifications-off-outline" size={60} color="#D1D5DB" />
                    <Text style={tw`text-gray-400 font-medium mt-4`}>No notifications yet</Text>
                </View>
            ) : (
                notifications.data.map((notif: any) => (
                    <Pressable 
                        key={notif._id} 
                        onPress={() => handleMarkRead(notif._id)}
                        style={tw`rounded-3xl p-5 mb-4 shadow-sm border border-gray-50 ${notif.isRead ? 'bg-white' : 'bg-green-50'}`}
                    >
                        <View style={tw`flex-row items-start`}>
                            <View style={tw`w-10 h-10 rounded-full ${notif.type === 'complaint' ? 'bg-red-100' : 'bg-blue-100'} items-center justify-center`}>
                                <Ionicons 
                                    name={notif.type === 'complaint' ? "alert-circle" : "person-add"} 
                                    size={24} 
                                    color={notif.type === 'complaint' ? "#EF4444" : "#3B82F6"} 
                                />
                            </View>
                            <View style={tw`ml-4 flex-1`}>
                                <View style={tw`flex-row justify-between items-center mb-1`}>
                                    <Text style={tw`font-bold text-gray-800 text-base`}>{notif.title}</Text>
                                    {!notif.isRead && <View style={tw`w-2 h-2 rounded-full bg-[#10B981]`} />}
                                </View>
                                <Text style={tw`text-gray-500 text-sm leading-5`}>{notif.message}</Text>
                                <Text style={tw`text-[10px] text-gray-400 mt-2`}>
                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                ))
            )}
        </ScrollView>
    );

    const renderDrivers = () => (
        <ScrollView style={tw`flex-1 px-6 pt-4`}>
            {/* Driver Requests Section */}
            <Text style={tw`text-sm font-bold text-gray-400 mb-4 ml-1`}>PENDING VERIFICATIONS</Text>
            {!pendingDrivers?.data?.length ? (
                <View style={tw`bg-white rounded-3xl p-6 mb-8 items-center border border-gray-50`}>
                    <Text style={tw`text-gray-400 font-medium`}>No pending requests</Text>
                </View>
            ) : (
                pendingDrivers.data.map((driver: any) => (
                    <View key={driver._id} style={tw`bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50`}>
                        <View style={tw`flex-row items-center`}>
                            <Image source={{ uri: driver.user?.avatar || 'https://via.placeholder.com/150' }} style={tw`w-12 h-12 rounded-full bg-gray-100`} />
                            <View style={tw`ml-4 flex-1`}>
                                <Text style={tw`font-bold text-gray-800 text-lg`}>{driver.user?.name}</Text>
                                <Text style={tw`text-gray-400 text-sm`}>{driver.vehicleType} • {driver.vehicleModel}</Text>
                            </View>
                            <Pressable 
                                onPress={() => handleVerify(driver._id)}
                                disabled={isVerifying}
                                style={tw`bg-[#10B981] px-4 py-2 rounded-xl`}
                            >
                                <Text style={tw`text-white font-bold text-xs`}>Verify</Text>
                            </Pressable>
                        </View>
                    </View>
                ))
            )}

            {/* Driver Complaints Section */}
            <Text style={tw`text-sm font-bold text-gray-400 mb-4 mt-4 ml-1`}>DRIVER COMPLAINTS</Text>
            {!driverComplaints.length ? (
                <View style={tw`bg-white rounded-3xl p-6 items-center border border-gray-50`}>
                    <Text style={tw`text-gray-400 font-medium`}>No driver complaints</Text>
                </View>
            ) : (
                driverComplaints.map((comp: any) => (
                    <View key={comp._id} style={tw`bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50 ${comp.isResolved ? 'opacity-50' : ''}`}>
                        <View style={tw`flex-row justify-between mb-3`}>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`w-8 h-8 rounded-full bg-red-50 items-center justify-center`}>
                                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                                </View>
                                <Text style={tw`ml-3 font-bold text-gray-800`}>{comp.subject}</Text>
                            </View>
                            {!comp.isResolved && (
                                <Pressable onPress={() => handleResolve(comp)} disabled={isResolving}>
                                    <Text style={tw`text-[#10B981] font-bold text-xs`}>Resolve</Text>
                                </Pressable>
                            )}
                        </View>
                        <Text style={tw`text-gray-800 font-bold text-sm mb-1`}>From: {comp.user?.name}</Text>
                        <Text style={tw`text-gray-500 text-sm leading-5`}>{comp.message}</Text>
                    </View>
                ))
            )}
            <View style={tw`h-10`} />
        </ScrollView>
    );

    const renderComplaints = () => (
        <ScrollView style={tw`flex-1 px-6 pt-4`}>
            <Text style={tw`text-sm font-bold text-gray-400 mb-4 ml-1`}>RIDER COMPLAINTS</Text>
            {!riderComplaints.length ? (
                <View style={tw`mt-10 items-center`}>
                    <Ionicons name="happy-outline" size={60} color="#D1D5DB" />
                    <Text style={tw`text-gray-400 font-medium mt-4`}>No active complaints from riders</Text>
                </View>
            ) : (
                riderComplaints.map((comp: any) => (
                    <View key={comp._id} style={tw`bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50 ${comp.isResolved ? 'opacity-50' : ''}`}>
                        <View style={tw`flex-row justify-between mb-3`}>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`w-8 h-8 rounded-full bg-red-50 items-center justify-center`}>
                                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                                </View>
                                <Text style={tw`ml-3 font-bold text-gray-800`}>{comp.subject}</Text>
                            </View>
                            {!comp.isResolved && (
                                <Pressable onPress={() => handleResolve(comp)} disabled={isResolving}>
                                    <Text style={tw`text-[#10B981] font-bold text-xs`}>Resolve</Text>
                                </Pressable>
                            )}
                        </View>
                        <Text style={tw`text-gray-800 font-bold text-sm mb-1`}>From: {comp.user?.name}</Text>
                        <Text style={tw`text-gray-500 text-sm leading-5`}>{comp.message}</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );

    return (
        <View style={tw`flex-1 bg-[#F9FAFB]`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                <View style={tw`px-6 py-4 flex-row items-center bg-white border-b border-gray-50`}>
                    <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </Pressable>
                    <Text style={tw`text-2xl font-bold text-gray-800 ml-2`}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={tw`ml-3 bg-[#10B981] px-2.5 py-1 rounded-full`}>
                            <Text style={tw`text-white text-xs font-bold`}>{unreadCount}</Text>
                        </View>
                    )}
                </View>

                <View style={tw`flex-row px-6 py-4 bg-white`}>
                    {['alerts', 'drivers', 'complaints'].map((tab: any) => (
                        <Pressable 
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={tw`flex-1 py-2 items-center border-b-2 ${activeTab === tab ? 'border-[#10B981]' : 'border-transparent'}`}
                        >
                            <Text style={tw`font-bold capitalize ${activeTab === tab ? 'text-[#10B981]' : 'text-gray-400'}`}>{tab}</Text>
                        </Pressable>
                    ))}
                </View>

                {activeTab === 'alerts' ? renderAlerts() : activeTab === 'drivers' ? renderDrivers() : renderComplaints()}
            </SafeAreaView>
        </View>
    );
}
