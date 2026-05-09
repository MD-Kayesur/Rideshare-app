import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useGetAllRidesQuery } from "../../redux/features/ride/rideApi";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../redux/features/auth/authSlice";
import tw from 'twrnc';

type Tab = 'Upcoming' | 'Completed' | 'Cancelled';

const HistoryPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Upcoming');
    const user = useSelector(useCurrentUser);
    
    const { data: rideData, isLoading } = useGetAllRidesQuery({ rider: user?._id });

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const getRidesByTab = () => {
        if (!rideData?.result) return [];
        
        switch (activeTab) {
            case 'Upcoming':
                return rideData.result.filter((r: any) => ['pending', 'accepted', 'ongoing'].includes(r.status));
            case 'Completed':
                return rideData.result.filter((r: any) => r.status === 'completed');
            case 'Cancelled':
                return rideData.result.filter((r: any) => r.status === 'cancelled');
            default:
                return [];
        }
    };

    const filteredRides = getRidesByTab();

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View style={tw`flex-row items-center px-6 py-4`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center absolute left-6 z-10`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg font-medium text-gray-800 ml-1`}>Back</Text>
                </Pressable>
                <View style={tw`flex-1 items-center`}>
                    <Text style={tw`text-2xl font-bold text-gray-900`}>History</Text>
                </View>
            </View>

            {/* Tabs Container */}
            <View style={tw`px-6 mb-6 mt-4`}>
                <View style={tw`flex-row bg-[#E6F7F1] rounded-2xl p-1`}>
                    {(['Upcoming', 'Completed', 'Cancelled'] as Tab[]).map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={tw`flex-1 py-4 rounded-xl items-center ${activeTab === tab ? 'bg-[#10B981]' : ''}`}
                        >
                            <Text style={tw`font-semibold text-base ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}>
                                {tab}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {isLoading ? (
                <View style={tw`flex-1 items-center justify-center`}>
                    <ActivityIndicator size="large" color="#10B981" />
                </View>
            ) : (
                <ScrollView style={tw`flex-1 px-6`} showsVerticalScrollIndicator={false}>
                    {filteredRides.map((ride: any) => (
                        <View
                            key={ride._id}
                            style={tw`bg-white border border-gray-100 rounded-[32px] p-6 mb-6 shadow-sm`}
                        >
                            {/* Ride Header: Driver & Time */}
                            <View style={tw`flex-row justify-between items-start mb-6`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-2xl font-bold text-gray-800 mb-1`}>
                                        {ride.driver?.name || 'Searching Driver...'}
                                    </Text>
                                    <View style={tw`flex-row items-center`}>
                                        <Ionicons name="call-outline" size={14} color="#10B981" style={tw`mr-1`} />
                                        <Text style={tw`text-gray-400 font-medium`}>
                                            {ride.driver?.phone || 'No contact info'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={tw`items-end`}>
                                    <Text style={tw`text-gray-400 text-sm font-medium mb-1`}>
                                        {formatTime(ride.createdAt)}
                                    </Text>
                                    <View style={tw`bg-[#E6F7F1] px-3 py-1 rounded-full`}>
                                        <Text style={tw`text-[#10B981] font-bold text-xs uppercase`}>
                                            {ride.rideType}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Location Details */}
                            <View style={tw`flex-row items-start mb-6`}>
                                <View style={tw`items-center mr-4`}>
                                    <View style={tw`w-2 h-2 rounded-full bg-[#10B981]`} />
                                    <View style={tw`w-0.5 h-6 bg-gray-100 my-1`} />
                                    <View style={tw`w-2 h-2 rounded-full bg-red-400`} />
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-400 text-xs mb-4`} numberOfLines={1}>
                                        {ride.pickupLocation.address}
                                    </Text>
                                    <Text style={tw`text-gray-800 font-bold text-sm`} numberOfLines={1}>
                                        {ride.destinationLocation.address}
                                    </Text>
                                </View>
                                <View style={tw`items-end justify-center h-full`}>
                                    <Text style={tw`text-xl font-black text-gray-800`}>${ride.fare}</Text>
                                </View>
                            </View>

                            {/* Payment Details Section */}
                            <View style={tw`border-t border-gray-50 pt-4 flex-row items-center justify-between`}>
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`w-10 h-10 bg-gray-50 rounded-xl items-center justify-center mr-3`}>
                                        {ride.paymentMethod === 'cash' ? (
                                            <Ionicons name="cash-outline" size={20} color="#10B981" />
                                        ) : (
                                            <FontAwesome name="credit-card" size={18} color="#10B981" />
                                        )}
                                    </View>
                                    <View>
                                        <Text style={tw`text-gray-800 font-bold text-sm uppercase`}>
                                            {ride.paymentMethod}
                                        </Text>
                                        {ride.paymentDetails && (
                                            <Text style={tw`text-gray-400 text-xs`}>
                                                {ride.paymentDetails.cardBrand} •••• {ride.paymentDetails.last4}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                
                                <View style={[tw`px-4 py-1.5 rounded-xl`, 
                                    ride.status === 'completed' ? tw`bg-[#E1F3ED]` : 
                                    ride.status === 'cancelled' ? tw`bg-red-50` : tw`bg-orange-50`]}>
                                    <Text style={[tw`font-bold text-xs capitalize`, 
                                        ride.status === 'completed' ? tw`text-[#10B981]` : 
                                        ride.status === 'cancelled' ? tw`text-red-500` : tw`text-orange-500`]}>
                                        {ride.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {filteredRides.length === 0 && (
                        <View style={tw`mt-20 items-center`}>
                            <Ionicons name="car-outline" size={64} color="#D1D5DB" />
                            <Text style={tw`mt-4 text-gray-400 text-lg font-medium`}>No {activeTab.toLowerCase()} rides found</Text>
                        </View>
                    )}
                    
                    <View style={tw`h-10`} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default HistoryPage;

