import React from 'react';
import { View, Text, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useGetMyChatsQuery } from '../../redux/features/chat/chatApi';
import { useAppSelector } from '../../redux/hooks';

export default function ChatHistoryScreen() {
    const { data: chatsData, isLoading, refetch } = useGetMyChatsQuery(undefined, {
        pollingInterval: 5000,
    });
    const user = useAppSelector((state) => state.auth.user);

    const chats = chatsData?.data || (Array.isArray(chatsData) ? chatsData : []);

    const renderChatItem = ({ item }: { item: any }) => {
        // Find the other participant (the person who is NOT the current user)
        const currentUserId = (user?._id || user?.id)?.toString();
        
        const otherParticipant = item.participants?.find((p: any) => {
            const pId = (typeof p === 'object' ? (p._id || p.id) : p)?.toString();
            return pId && currentUserId && pId !== currentUserId;
        }) || item.participants?.find((p: any) => {
            const pId = (typeof p === 'object' ? (p._id || p.id) : p)?.toString();
            return pId && pId !== currentUserId;
        }) || (typeof item.participants?.[0] === 'object' ? item.participants?.[0] : {});

        const lastMessage = item.lastMessage;

        return (
            <Pressable
                onPress={() => router.push({
                    pathname: '/(pages)/chat',
                    params: { 
                        chatId: item._id,
                        userName: otherParticipant?.name,
                        userAvatar: otherParticipant?.avatar
                    }
                })}
                style={tw`flex-row items-center p-4 bg-white border-b border-gray-100`}
            >
                <View style={tw`w-14 h-14 rounded-full overflow-hidden border border-gray-100`}>
                    <Image
                        source={{ uri: otherParticipant?.avatar || 'https://avatar.iran.liara.run/public/boy' }}
                        style={tw`w-full h-full`}
                    />
                </View>
                <View style={tw`flex-1 ml-4`}>
                    <View style={tw`flex-row justify-between items-center mb-1`}>
                        <Text style={tw`text-lg font-bold text-gray-800`}>
                            {otherParticipant?.name || 'Unknown User'}
                        </Text>
                        <Text style={tw`text-gray-400 text-xs`}>
                            {lastMessage?.createdAt ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                    </View>
                    <Text style={tw`text-gray-500 text-sm`} numberOfLines={1}>
                        {lastMessage?.content || 'No messages yet'}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            {/* Header */}
            <View style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}>
                <Pressable onPress={() => router.back()} style={tw`p-2`}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </Pressable>
                <Text style={tw`text-xl font-bold text-gray-800 ml-2`}>Chat History</Text>
            </View>

            {isLoading && !chats.length ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#10B981" />
                </View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item, index) => (item._id || item.id || `chat-${index}`).toString()}
                    renderItem={renderChatItem}
                    contentContainerStyle={tw`flex-grow pb-10`}
                    ListEmptyComponent={
                        <View style={tw`flex-1 justify-center items-center mt-20 px-10`}>
                            <View style={tw`w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-4`}>
                                <Ionicons name="chatbubbles-outline" size={48} color="#D1D5DB" />
                            </View>
                            <Text style={tw`text-gray-800 text-lg font-bold mb-2`}>No conversations yet</Text>
                            <Text style={tw`text-gray-400 text-center text-sm`}>
                                When you start a chat with someone, it will appear here.
                            </Text>
                        </View>
                    }
                    onRefresh={refetch}
                    refreshing={isLoading}
                />
            )}
        </SafeAreaView>
    );
}
