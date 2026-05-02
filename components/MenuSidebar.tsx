import React from "react";
import { View, Text, Pressable, ScrollView, Image, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import tw from 'twrnc';

import { useAppSelector } from "../redux/hooks";

interface MenuSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    animValue: Animated.Value;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MenuSidebar = ({ isOpen, onClose, animValue }: MenuSidebarProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const menuItems = [
        { id: '1', title: 'History', icon: 'file', provider: 'Octicons', route: '/(pages)/history' },
        { id: '1a', title: 'Messages', icon: 'chatbubbles-outline', provider: 'Ionicons', route: '/(pages)/chat-history' },
        { id: '2', title: 'Complain', icon: 'chatbubble-ellipses-outline', provider: 'Ionicons', route: '/(pages)/complain' },
        { id: '3', title: 'Referral', icon: 'account-group-outline', provider: 'MaterialCommunityIcons', route: '/(pages)/referral' },
        { id: '4', title: 'About Us', icon: 'info', provider: 'Octicons', route: '/(pages)/about' },
        { id: '5', title: 'Settings', icon: 'settings-outline', provider: 'Ionicons', route: '/(pages)/settings' },
        { id: '6', title: 'Help and Support', icon: 'help-circle-outline', provider: 'Ionicons', route: '/(pages)/help' },
        { id: '7', title: 'Logout', icon: 'logout', provider: 'MaterialCommunityIcons', route: '/(auth)/login' },
    ];

    const renderIcon = (item: any) => {
        if (item.provider === 'Octicons') {
            return <Octicons name={item.icon as any} size={22} color="#374151" />;
        }
        if (item.provider === 'MaterialCommunityIcons') {
            return <MaterialCommunityIcons name={item.icon as any} size={24} color="#374151" />;
        }
        return <Ionicons name={item.icon as any} size={24} color="#374151" />;
    };

    if (!isOpen) return null;

    return (
        <>
            <Pressable
                style={[tw`absolute inset-0 bg-black/40 z-40`]}
                onPress={onClose}
            />
            <Animated.View
                style={[
                    tw`absolute top-0 bottom-0 left-0 w-80 bg-white z-50 shadow-2xl`,
                    {
                        transform: [{ translateX: animValue }],
                        borderTopRightRadius: 150,
                        borderBottomRightRadius: 150,
                    }
                ]}
            >
                <SafeAreaView style={tw`flex-1`}>
                    <View style={tw`px-10 pt-6 `}>
                        <Pressable onPress={onClose} style={tw`flex-row items-center mb-10`}>
                            <Ionicons name="chevron-back" size={28} color="#333" />
                            <Text style={tw`text-xl text-gray-800 ml-1 font-medium`}>Back</Text>
                        </Pressable>

                        <View style={tw`mb-6`}>
                            <View style={tw`w-28 h-28 rounded-full items-center justify-center overflow-hidden mb-4 border-2 border-[#10B981]/20 p-1`}>
                                <Image
                                    source={user?.avatar ? { uri: user.avatar } : require("../assets/images/image.png")}
                                    style={tw`w-full h-full rounded-full bg-[#E0F2FE]`}
                                    resizeMode="cover"
                                />
                            </View>
                            <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>{user?.name || 'User Name'}</Text>
                            <Text style={tw`text-base text-gray-500`}>{user?.email || 'user@email.com'}</Text>
                        </View>
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
                                style={tw`flex-row items-center px-10 py-3 border-b border-gray-50`}
                            >
                                <View style={tw`w-8 items-center`}>
                                    {renderIcon(item)}
                                </View>
                                <Text style={tw`text-lg font-medium text-gray-800 ml-4`}>{item.title}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </Animated.View>
        </>
    );
};
