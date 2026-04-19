import React from "react";
import { View, Text, Pressable, ScrollView, Image, Animated, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import tw from 'twrnc';

interface MenuSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    animValue: Animated.Value;
}

export const MenuSidebar = ({ isOpen, onClose, animValue }: MenuSidebarProps) => {
    const menuItems = [
        { id: '1', title: 'History', icon: 'list-outline', route: '/(pages)/history' },
        { id: '2', title: 'Complain', icon: 'chatbubble-outline', route: '/(pages)/complain' },
        { id: '3', title: 'Referral', icon: 'people-outline', route: '/(pages)/referral' },
        { id: '4', title: 'About Us', icon: 'information-circle-outline', route: '/(pages)/about' },
        { id: '5', title: 'Settings', icon: 'settings-outline', route: '/(pages)/settings' },
        { id: '6', title: 'Help and Support', icon: 'help-circle-outline', route: '/(pages)/help' },
        { id: '7', title: 'Logout', icon: 'log-out-outline', route: '/(auth)/login' },
    ];

    if (!isOpen) return null;

    return (
        <>
            <Pressable
                style={[tw`absolute inset-0 bg-black/40 z-[9998]`]}
                onPress={onClose}
            />
            <Animated.View
                style={[
                    tw`absolute top-0 bottom-0 left-0 w-85 bg-white z-[9999] shadow-2xl`,
                    {
                        transform: [{ translateX: animValue }],
                        borderTopRightRadius: 180,
                    }
                ]}
            >
                <SafeAreaView style={tw`flex-1`}>
                    <View style={tw`px-8 pt-6 pb-8`}>
                        <Pressable onPress={onClose} style={tw`flex-row items-center mb-10`}>
                            <Ionicons name="chevron-back" size={28} color="#333" />
                            <Text style={tw`text-xl font-medium text-gray-800 ml-1`}>Back</Text>
                        </Pressable>
                        <View style={tw`bg-[#D1FAE5] w-24 h-24 rounded-full p-1 items-center justify-center overflow-hidden mb-6 border border-[#10B981]`}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1540560714873-45f69ee7333a?auto=format&fit=crop&w=200&h=200&q=80' }}
                                style={tw`w-full h-full rounded-full`}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>Nate Samson</Text>
                        <Text style={tw`text-base text-gray-500`}>nate@email.com</Text>
                    </View>
                    <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
                        {menuItems.map(item => (
                            <Pressable
                                key={item.id}
                                onPress={() => {
                                    onClose();
                                    if (item.title === 'Logout') {
                                        router.replace(item.route as any);
                                    } else {
                                        router.push(item.route as any);
                                    }
                                }}
                                style={tw`flex-row items-center px-10 py-6 border-b border-gray-100`}
                            >
                                <Ionicons name={item.icon as any} size={28} color="#374151" />
                                <Text style={tw`text-xl font-bold text-gray-800 ml-5`}>{item.title}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </Animated.View>
        </>
    );
};
