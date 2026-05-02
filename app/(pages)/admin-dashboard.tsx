import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useGetPendingDriversQuery, useVerifyDriverMutation } from '../../redux/features/driver/driverApi';
import { useGetAllUsersQuery } from '../../redux/features/auth/authApi';

export default function AdminDashboard() {
    const { data: pendingData, isLoading: isLoadingPending } = useGetPendingDriversQuery({});
    const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsersQuery({});
    const [verifyDriver, { isLoading: isVerifying }] = useVerifyDriverMutation();

    const stats = [
        { label: 'Total Users', value: usersData?.data?.length || 0, icon: 'people', color: '#10B981' },
        { label: 'Pending Drivers', value: pendingData?.data?.length || 0, icon: 'time', color: '#F59E0B' },
        { label: 'Verified Drivers', value: (usersData?.data?.filter((u: any) => u.role === 'driver')?.length || 0) - (pendingData?.data?.length || 0), icon: 'checkmark-circle', color: '#3B82F6' },
    ];

    const handleVerify = async (driverId: string) => {
        try {
            await verifyDriver(driverId).unwrap();
            Alert.alert("Success", "Driver verified successfully!");
        } catch (error: any) {
            Alert.alert("Error", error?.data?.message || "Failed to verify driver");
        }
    };

    return (
        <View style={tw`flex-1 bg-[#F9FAFB]`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`px-6 py-4 flex-row items-center bg-white border-b border-gray-100`}>
                    <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </Pressable>
                    <View style={tw`ml-2`}>
                        <Text style={tw`text-2xl font-bold text-gray-800`}>Admin Panel</Text>
                        <Text style={tw`text-gray-400 text-sm`}>rmdkayesur@gmail.com</Text>
                    </View>
                </View>

                <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-10`}>
                    {/* Stats Grid */}
                    <View style={tw`flex-row flex-wrap px-6 pt-6 gap-4`}>
                        {stats.map((stat, index) => (
                            <View key={index} style={tw`bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex-1 min-w-[45%]`}>
                                <View style={[tw`w-10 h-10 rounded-2xl items-center justify-center mb-3`, { backgroundColor: `${stat.color}15` }]}>
                                    <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                                </View>
                                <Text style={tw`text-3xl font-black text-gray-800`}>{stat.value}</Text>
                                <Text style={tw`text-sm text-gray-500 font-medium`}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Pending Requests Section */}
                    <View style={tw`px-6 mt-8`}>
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <Text style={tw`text-xl font-bold text-gray-800`}>Pending Verifications</Text>
                            <View style={tw`bg-[#F59E0B] px-3 py-1 rounded-full`}>
                                <Text style={tw`text-white text-xs font-bold`}>{pendingData?.data?.length || 0} New</Text>
                            </View>
                        </View>

                        {isLoadingPending ? (
                            <ActivityIndicator size="large" color="#10B981" style={tw`mt-10`} />
                        ) : pendingData?.data?.length === 0 ? (
                            <View style={tw`bg-white rounded-3xl p-10 items-center justify-center border border-dashed border-gray-200`}>
                                <Ionicons name="checkmark-done-circle-outline" size={60} color="#D1D5DB" />
                                <Text style={tw`text-gray-400 font-medium mt-4`}>No pending requests</Text>
                            </View>
                        ) : (
                            pendingData?.data?.map((driver: any) => (
                                <View key={driver._id} style={tw`bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50`}>
                                    <View style={tw`flex-row items-center`}>
                                        <Image 
                                            source={{ uri: driver.user?.avatar || 'https://via.placeholder.com/150' }} 
                                            style={tw`w-14 h-14 rounded-full bg-gray-100`}
                                        />
                                        <View style={tw`ml-4 flex-1`}>
                                            <Text style={tw`text-lg font-bold text-gray-800`}>{driver.user?.name}</Text>
                                            <Text style={tw`text-gray-400 text-sm`}>{driver.vehicleType.toUpperCase()} • {driver.vehicleModel}</Text>
                                        </View>
                                        <View style={tw`bg-[#10B981]/10 px-3 py-1 rounded-lg`}>
                                            <Text style={tw`text-[#10B981] text-xs font-bold`}>{driver.vehicleType}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`mt-4 pt-4 border-t border-gray-50 flex-row gap-3`}>
                                        <Pressable 
                                            onPress={() => Alert.alert("Vehicle Info", `Plate: ${driver.vehicleNumber}\nLicense: ${driver.licenseNumber}`)}
                                            style={tw`flex-1 bg-gray-50 py-3 rounded-xl items-center`}
                                        >
                                            <Text style={tw`text-gray-600 font-bold`}>View Info</Text>
                                        </Pressable>
                                        <Pressable 
                                            onPress={() => handleVerify(driver._id)}
                                            disabled={isVerifying}
                                            style={tw`flex-2 bg-[#10B981] py-3 rounded-xl items-center shadow-sm`}
                                        >
                                            {isVerifying ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <Text style={tw`text-white font-bold`}>Verify Driver</Text>
                                            )}
                                        </Pressable>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
