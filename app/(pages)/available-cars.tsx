import React from 'react';
import { View, Text, Pressable, Image, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useGetNearbyDriversQuery } from '../../redux/features/driver/driverApi';
import { useAppSelector } from '../../redux/hooks';

export default function AvailableCarsScreen() {
    const { transportType } = useLocalSearchParams();
    const user = useAppSelector(state => state.auth.user);
    const currentTransportType = (transportType as string) || 'Car';
    const mappedType = currentTransportType.toLowerCase() === 'taxi' ? 'cng' : currentTransportType.toLowerCase();

    // Fetch real nearby drivers (using user location or default)
    const { data: nearbyData, isLoading } = useGetNearbyDriversQuery({
        lat: user?.currentLocation?.coordinates?.[1] || 23.8103, // Default to Dhaka
        lng: user?.currentLocation?.coordinates?.[0] || 90.4125,
        vehicleType: mappedType
    });

    // Format real drivers to match the UI structure
    const realDrivers = nearbyData?.data?.map((d: any) => ({
        id: d._id,
        name: d.vehicleModel,
        transmission: 'Automatic', 
        seats: d.vehicleType === 'car' ? 4 : d.vehicleType === 'bike' ? 2 : 1,
        fuel: d.details?.isAC ? 'AC' : 'Non-AC',
        distance: d.distance || 'Nearby',
        time: '3mins away',
        image: d.vehicleImage ? { uri: d.vehicleImage } : { uri: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop' },
        isReal: true,
        userId: d.user?._id
    })) || [];

    // Show only real drivers from the database
    const displayVehicles = realDrivers;

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
                    <Text style={tw`text-2xl font-bold text-gray-800`}>Available {currentTransportType.toLowerCase()}s for ride</Text>
                    <Text style={tw`text-gray-400 mt-1`}>{displayVehicles.length} found</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                    {displayVehicles.map((vehicle: any) => (
                        <View
                            key={vehicle.id}
                            style={tw`bg-[#E6F7F1]/30 border border-[#10B981]/10 rounded-3xl p-5 mb-6`}
                        >
                            <View style={tw`flex-row justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>{vehicle.name}</Text>
                                    <View style={tw`flex-row flex-wrap items-center gap-2`}>
                                        <Text style={tw`text-gray-400`}>{vehicle.transmission}</Text>
                                        <Text style={tw`text-gray-300`}>|</Text>
                                        <Text style={tw`text-gray-400`}>{vehicle.seats} seats</Text>
                                        <Text style={tw`text-gray-300`}>|</Text>
                                        <Text style={tw`text-gray-400`}>{vehicle.fuel}</Text>
                                    </View>
                                    <View style={tw`flex-row items-center mt-3`}>
                                        <Ionicons name="location" size={16} color="#10B981" />
                                        <Text style={tw`ml-1 text-gray-600 font-medium`}>
                                            {vehicle.distance} <Text style={tw`text-gray-400 font-normal`}>({vehicle.time})</Text>
                                        </Text>
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
                                        transportType: currentTransportType,
                                        driverId: vehicle.isReal ? vehicle.userId : undefined
                                    }
                                })}
                                style={tw`bg-white border border-[#10B981] py-4 rounded-xl items-center`}
                            >
                                <Text style={tw`text-[#10B981] font-bold text-lg`}>View details</Text>
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
