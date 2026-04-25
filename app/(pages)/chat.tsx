import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Image, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
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

export default function ChatScreen() {
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef<ScrollView>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: inputText,
                time: 'Just now',
                type: 'sent',
            };
            setMessages(prev => [...prev, newMessage]);
            setInputText('');

            // Automatic reply simulation
            setTimeout(() => {
                const replyMessage = {
                    id: (Date.now() + 1).toString(),
                    text: 'Thank you for your message! Our support team will get back to you shortly.',
                    time: 'Just now',
                    type: 'received',
                };
                setMessages(prev => [...prev, replyMessage]);
            }, 1500);
        }
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={tw`flex-1`}
            >
                <SafeAreaView style={tw`flex-1`}>
                    {/* Header */}
                    <View style={tw`flex-row items-center px-6 py-4 border-b border-gray-50`}>
                        <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                            <Ionicons name="chevron-back" size={24} color="#374151" />
                            <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                        </Pressable>
                        <Text style={tw`text-xl font-bold text-gray-800 flex-1 text-center mr-10`}>Chat</Text>
                    </View>

                    {/* Chat Content */}
                    <ScrollView
                        ref={scrollRef}
                        style={tw`flex-1 px-6 pt-6`}
                        contentContainerStyle={tw`pb-6`}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((msg: any) => (
                            <View key={msg.id} style={tw`mb-6`}>
                                <View style={tw`flex-row ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.type === 'received' && (
                                        <View style={tw`w-10 h-10 rounded-full mr-3 overflow-hidden border border-gray-100`}>
                                            <Image source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Sergio' }} style={tw`w-full h-full`} />
                                        </View>
                                    )}
                                    <View style={tw`max-w-[70%]`}>
                                        <View style={tw`px-4 py-3 rounded-2xl ${msg.type === 'sent' ? 'bg-[#E6F7F1] rounded-tr-none' : 'bg-gray-100 rounded-tl-none'}`}>
                                            <Text style={tw`text-gray-700 text-base leading-5`}>{msg.text}</Text>
                                        </View>
                                        <Text style={tw`text-gray-400 text-xs mt-1 ${msg.type === 'sent' ? 'text-right' : 'text-left'}`}>
                                            {msg.time}
                                        </Text>
                                    </View>
                                    {msg.type === 'sent' && (
                                        <View style={tw`w-10 h-10 rounded-full ml-3 overflow-hidden border border-gray-100`}>
                                            <Image source={{ uri: 'https://avatar.iran.liara.run/public/girl?username=Maria' }} style={tw`w-full h-full`} />
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}
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
                            <Pressable onPress={handleSend} style={tw`p-2`}>
                                <Ionicons name="paper-plane" size={24} color="#9CA3AF" />
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
}
