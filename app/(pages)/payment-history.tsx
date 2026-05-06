import React from "react";
import { View, Text, Pressable, FlatList, ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import tw from 'twrnc';
import { useGetMyPaymentsQuery } from "../../redux/features/payment/paymentApi";
import { useAppSelector } from "../../redux/hooks";

export default function PaymentHistoryScreen() {
    const user = useAppSelector(state => state.auth.user);
    const { data: paymentsData, isLoading, refetch } = useGetMyPaymentsQuery({});

    const payments = paymentsData?.data || [];

    const renderPaymentItem = ({ item }: { item: any }) => (
        <View style={tw`bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`w-12 h-12 bg-[#10B981]/10 rounded-2xl items-center justify-center`}>
                        <Ionicons name="card-outline" size={24} color="#10B981" />
                    </View>
                    <View style={tw`ml-4`}>
                        <Text style={tw`text-lg font-bold text-gray-800`}>Ride Payment</Text>
                        <Text style={tw`text-xs text-gray-400`}>{new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                </View>
                <Text style={tw`text-xl font-black text-[#10B981]`}>${item.amount || '0.00'}</Text>
            </View>

            <View style={tw`h-[1px] bg-gray-50 mb-4`} />

            <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row items-center`}>
                    <MaterialCommunityIcons name="car-side" size={20} color="#6B7280" />
                    <Text style={tw`text-sm text-gray-600 ml-2 font-medium`}>{item.ride?.vehicleType || 'Car'}</Text>
                </View>
                <View style={tw`bg-gray-50 px-3 py-1 rounded-full`}>
                    <Text style={tw`text-[10px] text-gray-500 font-bold uppercase tracking-wider`}>{item.status}</Text>
                </View>
            </View>

            <View style={tw`mt-4 flex-row items-center`}>
                <Ionicons name="location-outline" size={16} color="#9CA3AF" />
                <Text style={tw`text-xs text-gray-500 ml-1 flex-1`} numberOfLines={1}>
                    {item.ride?.destinationLocation?.address || 'Destination Address'}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-[#F9FAFB]`}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={tw`px-6 py-4 flex-row items-center bg-white border-b border-gray-100`}>
                <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </Pressable>
                <Text style={tw`text-xl font-bold text-gray-800 ml-2`}>Payment History</Text>
            </View>

            <View style={tw`px-6 pt-6 pb-2`}>
                <View style={tw`bg-[#10B981] rounded-3xl p-6 shadow-lg shadow-[#10B981]/30 mb-6`}>
                    <Text style={tw`text-white/80 text-sm font-medium mb-1`}>Total Spent</Text>
                    <Text style={tw`text-white text-3xl font-black mb-4`}>
                        ${payments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0).toFixed(2)}
                    </Text>
                    <View style={tw`flex-row justify-between items-center bg-white/10 rounded-2xl p-3`}>
                        <View>
                            <Text style={tw`text-white/60 text-[10px] uppercase font-bold`}>Total Rides</Text>
                            <Text style={tw`text-white font-bold`}>{payments.length}</Text>
                        </View>
                        <View style={tw`w-[1px] h-8 bg-white/20`} />
                        <View>
                            <Text style={tw`text-white/60 text-[10px] uppercase font-bold text-right`}>Last Payment</Text>
                            <Text style={tw`text-white font-bold text-right`}>
                                {payments.length > 0 ? `$${(payments[0].amount || 0).toFixed(2)}` : 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>
                
                <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Recent Transactions</Text>
            </View>

            {isLoading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#10B981" />
                </View>
            ) : (
                <FlatList
                    data={payments}
                    renderItem={renderPaymentItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={tw`px-6 pb-20`}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={tw`flex-1 items-center justify-center pt-20`}>
                            <View style={tw`w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4`}>
                                <Ionicons name="card-outline" size={40} color="#9CA3AF" />
                            </View>
                            <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>No Transactions</Text>
                            <Text style={tw`text-gray-500 text-center px-10`}>
                                You haven't made any payments yet. Completed rides will appear here.
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
