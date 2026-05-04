import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import tw from 'twrnc';

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useToggleOnlineMutation, useGetMeQuery } from "../redux/features/auth/authApi";
import { setUser } from "../redux/features/auth/authSlice";

interface MenuSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    animValue: Animated.Value;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MenuSidebar = ({ isOpen, onClose, animValue }: MenuSidebarProps) => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const { data: meData } = useGetMeQuery(undefined, { skip: !isOpen });
    const authUser = useAppSelector((state) => state.auth.user);
    const user = meData?.data || authUser;
    const [toggleOnline] = useToggleOnlineMutation();
    const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

    const vehicleTypes = [
        { id: 'v1', title: 'Car', icon: 'car-outline' },
        { id: 'v2', title: 'Bike', icon: 'bicycle-outline' },
        { id: 'v3', title: 'Cycle', icon: 'bicycle-outline' },
        { id: 'v4', title: 'CNG', icon: 'car-sport-outline' },
    ];
    const menuItems = [
        { id: '1', title: 'History', icon: 'file', provider: 'Octicons', route: '/(pages)/history' },
        { id: '1a', title: 'Messages', icon: 'chatbubbles-outline', provider: 'Ionicons', route: '/chat_history' },
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
                        {user?.role === 'admin' && (
                            <View style={tw`border-b border-gray-100 bg-[#10B981]/5`}>
                                <Pressable
                                    onPress={() => {
                                        onClose();
                                        router.push('/(pages)/admin-dashboard');
                                    }}
                                    style={tw`flex-row items-center px-10 py-4`}
                                >
                                    <View style={tw`w-8 items-center`}>
                                        <Ionicons name="shield-checkmark-outline" size={24} color="#10B981" />
                                    </View>
                                    <Text style={tw`text-lg font-bold text-[#10B981] ml-4`}>Admin Dashboard</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        onClose();
                                        router.push('/(pages)/admin-notifications');
                                    }}
                                    style={tw`flex-row items-center px-10 py-4 border-t border-[#10B981]/10`}
                                >
                                    <View style={tw`w-8 items-center`}>
                                        <Ionicons name="notifications-outline" size={24} color="#10B981" />
                                    </View>
                                    <Text style={tw`text-lg font-bold text-[#10B981] ml-4`}>Notifications</Text>
                                    <View style={tw`ml-auto bg-red-500 w-5 h-5 rounded-full items-center justify-center`}>
                                        <Text style={tw`text-white text-[10px] font-bold`}>!</Text>
                                    </View>
                                </Pressable>
                            </View>
                        )}

                        {user?.role === 'driver' && (
                            <View style={tw`border-b border-gray-50`}>
                                <View style={tw`px-10 py-4 flex-row items-center justify-between bg-[#10B981]/5 mb-2`}>
                                    <View style={tw`flex-row items-center`}>
                                        <Octicons 
                                            name="dot-fill" 
                                            size={20} 
                                            color={user?.isOnline ? "#10B981" : "#EF4444"} 
                                        />
                                        <Text style={tw`text-lg font-bold text-gray-800 ml-3`}>
                                            {user?.isOnline ? 'Online' : 'Offline'}
                                        </Text>
                                    </View>
                                    <Pressable 
                                        onPress={async () => {
                                            try {
                                                const newStatus = !user?.isOnline;
                                                const res = await toggleOnline({ isOnline: newStatus }).unwrap();
                                                if (res.success) {
                                                    // Sync with auth slice for other components
                                                    dispatch(setUser({ user: res.data, token: token as string }));
                                                }
                                            } catch (err) {
                                                console.error("Toggle online failed", err);
                                            }
                                        }}
                                        style={tw`w-14 h-8 rounded-full ${user?.isOnline ? 'bg-[#10B981]' : 'bg-gray-300'} p-1 justify-center`}
                                    >
                                        <View style={[
                                            tw`w-6 h-6 rounded-full bg-white shadow-sm`,
                                            { transform: [{ translateX: user?.isOnline ? 24 : 0 }] }
                                        ]} />
                                    </Pressable>
                                </View>

                                <Pressable
                                    onPress={() => setIsAddVehicleOpen(!isAddVehicleOpen)}
                                    style={tw`flex-row items-center px-10 py-3`}
                                >
                                    <View style={tw`w-8 items-center`}>
                                        <Ionicons name="add-circle-outline" size={24} color="#10B981" />
                                    </View>
                                    <Text style={tw`text-lg font-bold text-[#10B981] ml-4 flex-1`}>Add Vehicle</Text>
                                    <Ionicons 
                                        name={isAddVehicleOpen ? "chevron-up" : "chevron-down"} 
                                        size={20} 
                                        color="#10B981" 
                                    />
                                </Pressable>

                                {isAddVehicleOpen && (
                                    <View style={tw`bg-gray-50/50 py-1`}>
                                        {vehicleTypes.map(v => (
                                            <Pressable
                                                key={v.id}
                                                onPress={() => {
                                                    onClose();
                                                    router.push({
                                                        pathname: "/(pages)/add-vehicle" as any,
                                                        params: { type: v.title.toLowerCase() }
                                                    });
                                                }}
                                                style={tw`flex-row items-center px-16 py-2.5`}
                                            >
                                                <Ionicons name={v.icon as any} size={18} color="#6B7280" />
                                                <Text style={tw`text-base text-gray-600 ml-3`}>{v.title}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}

                        {menuItems.map((item, index) => (
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
                                style={tw`flex-row items-center px-10 py-3 ${index >= menuItems.length - 2 ? '' : '  '}`}
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
