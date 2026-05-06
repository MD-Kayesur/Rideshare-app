import React from "react";
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator, Alert, StatusBar, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import tw from 'twrnc';
import { useGetMyVehiclesQuery, useDeleteVehicleMutation } from "../../redux/features/vehicle/vehicleApi";

export default function MyCarsScreen() {
    const { data: vehiclesData, isLoading, refetch } = useGetMyVehiclesQuery({});
    const [deleteVehicle] = useDeleteVehicleMutation();

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Vehicle",
            "Are you sure you want to remove this vehicle?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteVehicle(id).unwrap();
                            Alert.alert("Success", "Vehicle removed successfully");
                        } catch (err) {
                            Alert.alert("Error", "Failed to delete vehicle");
                        }
                    }
                }
            ]
        );
    };

    const renderVehicle = ({ item }: { item: any }) => (
        <View style={tw`bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100`}>
            <View style={tw`flex-row`}>
                <Image 
                    source={{ uri: item.vehicleImage }} 
                    style={tw`w-24 h-24 rounded-2xl bg-gray-100`} 
                    resizeMode="cover"
                />
                <View style={tw`ml-4 flex-1`}>
                    <View style={tw`flex-row justify-between items-start`}>
                        <View>
                            <Text style={tw`text-lg font-bold text-gray-800`}>{item.vehicleModel}</Text>
                            <Text style={tw`text-sm text-gray-500 uppercase tracking-wider`}>{item.vehicleType}</Text>
                        </View>
                        <Pressable onPress={() => handleDelete(item._id)} style={tw`p-1`}>
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </Pressable>
                    </View>
                    
                    <View style={tw`flex-row items-center mt-3`}>
                        <MaterialCommunityIcons name="numeric" size={16} color="#9CA3AF" />
                        <Text style={tw`text-sm text-gray-600 ml-1 font-medium`}>{item.vehicleNumber || 'No Plate'}</Text>
                    </View>

                    <View style={tw`flex-row items-center mt-1`}>
                        <Ionicons 
                            name={item.isVerified ? "shield-checkmark" : "time-outline"} 
                            size={16} 
                            color={item.isVerified ? "#10B981" : "#F59E0B"} 
                        />
                        <Text style={tw`text-xs ml-1 ${item.isVerified ? 'text-[#10B981]' : 'text-[#F59E0B]'} font-bold`}>
                            {item.isVerified ? 'VERIFIED' : 'PENDING VERIFICATION'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-[#F9FAFB]`}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={tw`px-6 py-4 flex-row items-center justify-between bg-white border-b border-gray-100`}>
                <View style={tw`flex-row items-center`}>
                    <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </Pressable>
                    <Text style={tw`text-xl font-bold text-gray-800 ml-2`}>My Vehicles</Text>
                </View>
                <Pressable 
                    onPress={() => router.push({ pathname: "/(pages)/add-vehicle", params: { type: 'car' } })}
                    style={tw`bg-[#10B981] p-2 rounded-full`}
                >
                    <Ionicons name="add" size={24} color="white" />
                </Pressable>
            </View>

            {isLoading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#10B981" />
                </View>
            ) : (
                <FlatList
                    data={vehiclesData?.data || []}
                    renderItem={renderVehicle}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={tw`p-6 pb-20`}
                    ListEmptyComponent={
                        <View style={tw`flex-1 items-center justify-center pt-20`}>
                            <View style={tw`w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4`}>
                                <Ionicons name="car-outline" size={40} color="#9CA3AF" />
                            </View>
                            <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>No Vehicles Added</Text>
                            <Text style={tw`text-gray-500 text-center px-10 mb-6`}>
                                Add your vehicles to start receiving ride requests.
                            </Text>
                            <Pressable 
                                onPress={() => router.push({ pathname: "/(pages)/add-vehicle", params: { type: 'car' } })}
                                style={tw`bg-[#10B981] px-8 py-3 rounded-2xl`}
                            >
                                <Text style={tw`text-white font-bold`}>Add Your First Car</Text>
                            </Pressable>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
