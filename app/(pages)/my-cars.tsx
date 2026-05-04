import React from 'react';
import { View, Text, Pressable, Image, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useGetMyDriverProfileQuery } from '../../redux/features/driver/driverApi';

export default function MyCarsScreen() {
    const { data: profileData, isLoading } = useGetMyDriverProfileQuery({});
    
    // Format the driver's car to match the UI structure
    const driver = profileData?.data;
    const vehicle = driver?.vehicleModel ? {
        id: driver._id,
        name: driver.vehicleModel,
        transmission: 'Automatic', // Static for now
        seats: driver.vehicleType === 'car' ? 4 : 2,
        fuel: driver.details?.isAC ? 'AC' : 'Non-AC',
        distance: '0m',
        time: 'Your vehicle',
        image: driver.vehicleImage ? { uri: driver.vehicleImage } : require('../../assets/images/car_transparent.png'),
        type: driver.vehicleType || 'car',
        number: driver.vehicleNumber
    } : null;

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1 px-6`}>
                {/* Header */}
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center py-4`}>
                    <Ionicons name="chevron-back" size={24} color="#374151" />
                    <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                </Pressable>

                <View style={tw`mt-4 mb-6`}>
                    <Text style={tw`text-2xl font-bold text-gray-800`}>My Vehicles</Text>
                    <Text style={tw`text-gray-400 mt-1`}>{vehicle ? '1' : '0'} found</Text>
                </View>

                {isLoading ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color="#10B981" />
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                        {vehicle ? (
                            <View style={tw`bg-[#E6F7F1]/30 border border-[#10B981]/10 rounded-3xl p-5 mb-6`}>
                                <View style={tw`flex-row justify-between mb-4`}>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>{vehicle.name}</Text>
                                        <View style={tw`flex-row flex-wrap items-center gap-2 mb-2`}>
                                            <View style={tw`bg-[#10B981]/10 px-2 py-0.5 rounded`}>
                                                <Text style={tw`text-[#10B981] text-xs font-bold uppercase`}>{vehicle.type}</Text>
                                            </View>
                                            <Text style={tw`text-gray-500 font-bold text-xs`}>{vehicle.number}</Text>
                                        </View>
                                        <View style={tw`flex-row flex-wrap items-center gap-2`}>
                                            <Text style={tw`text-gray-400 text-sm`}>{vehicle.transmission}</Text>
                                            <Text style={tw`text-gray-300`}>|</Text>
                                            <Text style={tw`text-gray-400 text-sm`}>{vehicle.seats} seats</Text>
                                            <Text style={tw`text-gray-300`}>|</Text>
                                            <Text style={tw`text-gray-400 text-sm`}>{vehicle.fuel}</Text>
                                        </View>
                                    </View>
                                    <Image 
                                        source={vehicle.image} 
                                        style={tw`w-24 h-24`} 
                                        resizeMode="contain"
                                    />
                                </View>

                                <Pressable
                                    onPress={() => router.push({
                                        pathname: '/(pages)/car-details',
                                        params: { 
                                            carId: vehicle.id, 
                                            name: vehicle.name, 
                                            transportType: vehicle.type,
                                            isMyCar: 'true'
                                        }
                                    })}
                                    style={tw`bg-white border border-[#10B981] py-4 rounded-xl items-center`}
                                >
                                    <Text style={tw`text-[#10B981] font-bold text-lg`}>View details</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View style={tw`items-center justify-center py-20`}>
                                <Ionicons name="car-outline" size={64} color="#D1D5DB" />
                                <Text style={tw`text-gray-500 text-lg mt-4 font-medium`}>No vehicle added yet</Text>
                                <Pressable 
                                    onPress={() => router.push('/(pages)/add-vehicle')}
                                    style={tw`mt-6 bg-[#10B981] px-6 py-3 rounded-xl`}
                                >
                                    <Text style={tw`text-white font-bold`}>Add Vehicle</Text>
                                </Pressable>
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}
