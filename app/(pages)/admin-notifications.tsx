import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { 
    useGetPendingDriversQuery, 
    useVerifyDriverMutation,
    useGetAllComplaintsQuery, 
    useResolveComplaintMutation 
} from '../../redux/features/driver/driverApi';

export default function AdminNotificationsScreen() {
    const [activeTab, setActiveTab] = useState<'drivers' | 'complaints'>('drivers');
    
    const { data: pendingDrivers, isLoading: isLoadingDrivers } = useGetPendingDriversQuery({});
    const { data: complaints, isLoading: isLoadingComplaints } = useGetAllComplaintsQuery({});
    
    const [verifyDriver, { isLoading: isVerifying }] = useVerifyDriverMutation();
    const [resolveComplaint, { isLoading: isResolving }] = useResolveComplaintMutation();

    const handleVerify = async (id: string) => {
        try {
            await verifyDriver(id).unwrap();
            Alert.alert("Success", "Driver approved!");
        } catch (err: any) {
            Alert.alert("Error", err?.data?.message || "Verification failed");
        }
    };

    const handleResolve = async (id: string) => {
        try {
            await resolveComplaint(id).unwrap();
            Alert.alert("Success", "Complaint marked as resolved");
        } catch (err: any) {
            Alert.alert("Error", err?.data?.message || "Resolution failed");
        }
    };

    const renderDrivers = () => (
        <ScrollView style={tw`flex-1 px-6 pt-4`}>
            {!pendingDrivers?.data?.length ? (
                <View style={tw`mt-10 items-center`}>
                    <Ionicons name="checkmark-done" size={60} color="#D1D5DB" />
                    <Text style={tw`text-gray-400 font-medium mt-4`}>No pending driver requests</Text>
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
        </ScrollView>
    );

    const renderComplaints = () => (
        <ScrollView style={tw`flex-1 px-6 pt-4`}>
            {!complaints?.data?.length ? (
                <View style={tw`mt-10 items-center`}>
                    <Ionicons name="happy-outline" size={60} color="#D1D5DB" />
                    <Text style={tw`text-gray-400 font-medium mt-4`}>No active complaints</Text>
                </View>
            ) : (
                complaints.data.map((comp: any) => (
                    <View key={comp._id} style={tw`bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50 ${comp.isResolved ? 'opacity-50' : ''}`}>
                        <View style={tw`flex-row justify-between mb-3`}>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`w-8 h-8 rounded-full bg-red-50 items-center justify-center`}>
                                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                                </View>
                                <Text style={tw`ml-3 font-bold text-gray-800`}>{comp.subject}</Text>
                            </View>
                            {comp.isResolved ? (
                                <View style={tw`bg-gray-100 px-2 py-1 rounded-lg`}>
                                    <Text style={tw`text-gray-400 text-[10px] font-bold`}>RESOLVED</Text>
                                </View>
                            ) : (
                                <Pressable onPress={() => handleResolve(comp._id)} disabled={isResolving}>
                                    <Text style={tw`text-[#10B981] font-bold text-xs`}>Resolve</Text>
                                </Pressable>
                            )}
                        </View>
                        <Text style={tw`text-gray-500 text-sm leading-5`}>{comp.message}</Text>
                        <View style={tw`mt-4 flex-row items-center`}>
                            <Text style={tw`text-xs text-gray-400 font-medium`}>From: {comp.user?.name}</Text>
                            <Text style={tw`text-xs text-gray-300 mx-2`}>•</Text>
                            <Text style={tw`text-xs text-gray-400`}>{new Date(comp.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );

    return (
        <View style={tw`flex-1 bg-[#F9FAFB]`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`px-6 py-4 flex-row items-center bg-white border-b border-gray-50`}>
                    <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </Pressable>
                    <Text style={tw`text-2xl font-bold text-gray-800 ml-2`}>Notifications</Text>
                </View>

                {/* Tabs */}
                <View style={tw`flex-row px-6 py-4 bg-white`}>
                    <Pressable 
                        onPress={() => setActiveTab('drivers')}
                        style={tw`flex-1 py-2 items-center border-b-2 ${activeTab === 'drivers' ? 'border-[#10B981]' : 'border-transparent'}`}
                    >
                        <Text style={tw`font-bold ${activeTab === 'drivers' ? 'text-[#10B981]' : 'text-gray-400'}`}>Drivers</Text>
                    </Pressable>
                    <Pressable 
                        onPress={() => setActiveTab('complaints')}
                        style={tw`flex-1 py-2 items-center border-b-2 ${activeTab === 'complaints' ? 'border-[#10B981]' : 'border-transparent'}`}
                    >
                        <Text style={tw`font-bold ${activeTab === 'complaints' ? 'text-[#10B981]' : 'text-gray-400'}`}>Complaints</Text>
                    </Pressable>
                </View>

                {activeTab === 'drivers' ? renderDrivers() : renderComplaints()}
            </SafeAreaView>
        </View>
    );
}
