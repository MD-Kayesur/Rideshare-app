import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Image, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const initialMessages = [
    { id: '1', text: 'Good Evening!', time: '8:29 pm', type: 'received' },
    { id: '2', text: 'Welcome to Car2go Customer Service', time: '8:29 pm', type: 'received' },
    { id: '3', text: 'Welcome to Car2go Customer Service', time: '8:29 pm', type: 'sent' },
    { id: '4', text: 'Welcome to Car2go Customer Service', time: '8:29 pm', type: 'received' },
    { id: '5', text: 'Welcome to Car2go Customer Service', time: 'Just now', type: 'sent' },
];

import { useLocalSearchParams } from 'expo-router';
import { useGetMessagesQuery, useSendMessageMutation, useCreateChatMutation, useMarkAsReadMutation } from '../../redux/features/chat/chatApi';
import { useChatSocket } from '../../hooks/useChatSocket';
import { useAppSelector } from '../../redux/hooks';
import { useCurrentUser } from '../../redux/features/auth/authSlice';

export default function ChatScreen() {
    const { chatId: initialChatId, userId, userName, userAvatar } = useLocalSearchParams(); 
    const [chatId, setChatId] = useState<string | null>(initialChatId as string || null);
    const [markAsRead] = useMarkAsReadMutation();
    const user = useAppSelector(useCurrentUser);
    
    // Check for valid chatId
    const isValidChatId = chatId && chatId !== 'undefined' && chatId !== 'null';

    const { data: messagesData, isLoading } = useGetMessagesQuery(chatId || 'none', { skip: !isValidChatId });
    
    useEffect(() => {
        if (isValidChatId) {
            markAsRead(chatId as string);
        }
    }, [chatId]);

    const [sendMessage] = useSendMessageMutation();
    const [createChat] = useCreateChatMutation();
    const socket = useChatSocket(chatId as string);
    
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef<ScrollView>(null);

    const messages = messagesData?.data || [];

    // Initialize chat if we only have a userId
    useEffect(() => {
        const initChat = async () => {
            if (!chatId && userId) {
                try {
                    const res = await createChat({ participants: [userId as string] }).unwrap();
                    setChatId(res.data?._id || res.data?.id);
                } catch (err) {
                    console.error("Failed to init chat:", err);
                }
            }
        };
        initChat();
    }, [chatId, userId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 200);
        }
    }, [messages]);

    const handleSend = async () => {
        if (inputText.trim()) {
            try {
                // Clear input immediately for better UX
                setInputText('');

                // Send via REST API - this will trigger the backend to broadcast via socket
                await sendMessage({ chatId, content: inputText }).unwrap();
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                style={tw`flex-1`}
            >
                <SafeAreaView style={tw`flex-1`}>
                    {/* Header */}
                    <View style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}>
                        <Pressable onPress={() => router.back()} style={tw`p-2`}>
                            <Ionicons name="chevron-back" size={24} color="#374151" />
                        </Pressable>
                        
                        <View style={tw`flex-row items-center flex-1 ml-2`}>
                            <View style={tw`w-10 h-10 rounded-full overflow-hidden border border-gray-100`}>
                                <Image 
                                    source={{ uri: (userAvatar as string) || 'https://avatar.iran.liara.run/public/boy' }} 
                                    style={tw`w-full h-full`} 
                                />
                            </View>
                            <View style={tw`ml-3`}>
                                <Text style={tw`text-lg font-bold text-gray-800`}>{userName || 'Chat'}</Text>
                                <Text style={tw`text-xs text-green-500`}>Online</Text>
                            </View>
                        </View>

                        <Pressable style={tw`p-2`}>
                            <Ionicons name="call-outline" size={22} color="#10B981" />
                        </Pressable>
                    </View>

                    {/* Chat Content */}
                    <ScrollView
                        ref={scrollRef}
                        style={tw`flex-1 px-2 pt-6`}
                        contentContainerStyle={tw`pb-6`}
                        showsVerticalScrollIndicator={false}
                    >
                        {isLoading ? (
                            <Text style={tw`text-center mt-10 text-gray-400`}>Loading messages...</Text>
                                        ) : messages.map((msg: any, index: number) => {
                            if (!msg) return null;
                            const currentUserId = (user?._id || user?.id)?.toString();
                            const senderId = (msg.sender?._id || msg.sender?.id || msg.sender)?.toString();
                            const isSent = currentUserId && senderId && currentUserId === senderId;
                            
                            return (
                                <View key={msg._id || msg.id || `msg-${index}`} style={tw`mb-6`}>
                                    <View style={tw`flex-row ${isSent ? 'justify-end' : 'justify-start'}`}>
                                        {!isSent && (
                                            <View style={tw`w-10 h-10 rounded-full mr-3 overflow-hidden border border-gray-100`}>
                                                <Image source={{ uri: msg.sender?.avatar || 'https://avatar.iran.liara.run/public/boy?username=Sergio' }} style={tw`w-full h-full`} />
                                            </View>
                                        )}
                                        <View style={tw`max-w-[70%]`}>
                                            <View style={tw`px-4 py-3 rounded-2xl ${isSent ? 'bg-[#E6F7F1] rounded-tr-none' : 'bg-gray-100 rounded-tl-none'}`}>
                                                <Text style={tw`text-gray-700 text-base leading-5`}>{msg.content || msg.text || ''}</Text>
                                            </View>
                                            <Text style={tw`text-gray-400 text-xs mt-1 ${isSent ? 'text-right' : 'text-left'}`}>
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : msg.time}
                                            </Text>
                                        </View>
                                        {isSent && (
                                            <View style={tw`w-10 h-10 rounded-full ml-3 overflow-hidden border border-gray-100`}>
                                                <Image source={{ uri: user?.avatar || 'https://avatar.iran.liara.run/public/girl?username=Maria' }} style={tw`w-full h-full`} />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Input Bar */}
                    <View style={tw`bg-white px-4 py-4 border-t border-gray-100`}>
                        <View style={tw`flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-2`}>
                            <Pressable style={tw`p-2`}>
                                <Ionicons name="add-circle-outline" size={28} color="#9CA3AF" />
                            </Pressable>
                            <TextInput
                                placeholder="Type your message"
                                style={tw`flex-1 text-base text-gray-800 px-2`}
                                placeholderTextColor="#9CA3AF"
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={handleSend}
                            />
                            <Pressable style={tw`p-2`}>
                                <Ionicons name="happy-outline" size={24} color="#9CA3AF" />
                            </Pressable>
                            <Pressable 
                                onPress={handleSend} 
                                disabled={!inputText.trim()}
                                style={tw`p-2`}
                            >
                                <Ionicons 
                                    name="paper-plane" 
                                    size={24} 
                                    color={inputText.trim() ? '#3B82F6' : '#9CA3AF'} 
                                />
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
}
