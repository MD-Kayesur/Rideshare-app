import React from 'react';
import { View, Text, Pressable, Image, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const transportData: Record<string, any[]> = {
    'Car': [
        { id: 'c1', name: 'BMW Cabrio', transmission: 'Automatic', seats: 3, fuel: 'Octane', distance: '800m', time: '5mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c2', name: 'Mustang Shelby GT', transmission: 'Automatic', seats: 3, fuel: 'Octane', distance: '1.2km', time: '8mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c3', name: 'BMW i8', transmission: 'Automatic', seats: 2, fuel: 'Electric', distance: '2.5km', time: '12mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c4', name: 'Jaguar Silber', transmission: 'Automatic', seats: 3, fuel: 'Octane', distance: '3.1km', time: '15mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c5', name: 'BMW M4', transmission: 'Automatic', seats: 4, fuel: 'Octane', distance: '3.8km', time: '18mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c6', name: 'Mustang Dark Horse', transmission: 'Manual', seats: 4, fuel: 'Octane', distance: '4.2km', time: '20mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c7', name: 'Tesla Model S', transmission: 'Automatic', seats: 5, fuel: 'Electric', distance: '5.0km', time: '22mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c8', name: 'Audi RS6', transmission: 'Automatic', seats: 5, fuel: 'Octane', distance: '5.5km', time: '25mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c9', name: 'Porsche 911', transmission: 'Automatic', seats: 2, fuel: 'Octane', distance: '6.2km', time: '28mins away', image: require('../../assets/images/car_transparent.png') },
        { id: 'c10', name: 'Mercedes AMG', transmission: 'Automatic', seats: 4, fuel: 'Octane', distance: '7.0km', time: '30mins away', image: require('../../assets/images/car_transparent.png') },
    ],
    'Taxi': [
        { id: 't1', name: 'NYC Yellow Cab', transmission: 'Automatic', seats: 4, fuel: 'Gasoline', distance: '500m', time: '3mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't2', name: 'Executive Taxi', transmission: 'Automatic', seats: 4, fuel: 'Hybrid', distance: '1.5km', time: '7mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't3', name: 'Eco Taxi', transmission: 'Automatic', seats: 4, fuel: 'Electric', distance: '2.0km', time: '10mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't4', name: 'Family Van Taxi', transmission: 'Automatic', seats: 7, fuel: 'Diesel', distance: '2.8km', time: '14mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't5', name: 'Luxury Taxi', transmission: 'Automatic', seats: 4, fuel: 'Octane', distance: '3.5km', time: '16mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't6', name: 'Airport Express', transmission: 'Automatic', seats: 4, fuel: 'Gasoline', distance: '4.1km', time: '18mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't7', name: 'Quick Cab', transmission: 'Automatic', seats: 4, fuel: 'Gasoline', distance: '4.8km', time: '22mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't8', name: 'Silver Taxi', transmission: 'Automatic', seats: 4, fuel: 'Hybrid', distance: '5.2km', time: '25mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't9', name: 'Metro Taxi', transmission: 'Automatic', seats: 4, fuel: 'Gasoline', distance: '6.0km', time: '28mins away', image: require('../../assets/images/taxi_transparent.png') },
        { id: 't10', name: 'Night Cab', transmission: 'Automatic', seats: 4, fuel: 'Gasoline', distance: '6.5km', time: '30mins away', image: require('../../assets/images/taxi_transparent.png') },
    ],
    'Bike': [
        { id: 'b1', name: 'Yamaha R1M', transmission: 'Manual', seats: 2, fuel: 'Octane', distance: '300m', time: '2mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b2', name: 'Scooter Pro', transmission: 'Automatic', seats: 2, fuel: 'Electric', distance: '1.0km', time: '5mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b3', name: 'Kawasaki Ninja', transmission: 'Manual', seats: 2, fuel: 'Octane', distance: '1.8km', time: '8mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b4', name: 'Honda CBR', transmission: 'Manual', seats: 2, fuel: 'Octane', distance: '2.5km', time: '12mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b5', name: 'Vespa Classic', transmission: 'Automatic', seats: 2, fuel: 'Gasoline', distance: '3.2km', time: '15mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b6', name: 'Ducati Panigale', transmission: 'Manual', seats: 1, fuel: 'Octane', distance: '4.0km', time: '18mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b7', name: 'Harley Cruiser', transmission: 'Manual', seats: 2, fuel: 'Octane', distance: '4.5km', time: '22mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b8', name: 'Suzuki Hayabusa', transmission: 'Manual', seats: 2, fuel: 'Octane', distance: '5.2km', time: '25mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b9', name: 'Electric Sport', transmission: 'Automatic', seats: 1, fuel: 'Electric', distance: '6.0km', time: '28mins away', image: require('../../assets/images/bike_transparent.png') },
        { id: 'b10', name: 'City Scooter', transmission: 'Automatic', seats: 2, fuel: 'Electric', distance: '6.8km', time: '32mins away', image: require('../../assets/images/bike_transparent.png') },
    ],
    'Cycle': [
        { id: 'cy1', name: 'City Hybrid', transmission: 'Manual', seats: 1, fuel: 'Human', distance: '200m', time: '1min away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy2', name: 'Electric Cycle', transmission: 'Automatic', seats: 1, fuel: 'Electric', distance: '800m', time: '4mins away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy3', name: 'Mountain Bike', transmission: 'Manual', seats: 1, fuel: 'Human', distance: '1.5km', time: '7mins away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy4', name: 'Road Racer', transmission: 'Manual', seats: 1, fuel: 'Human', distance: '2.2km', time: '10mins away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy5', name: 'Folding Bike', transmission: 'Manual', seats: 1, fuel: 'Human', distance: '3.0km', time: '14mins away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy6', name: 'Cargo Cycle', transmission: 'Manual', seats: 1, fuel: 'Human', distance: '3.8km', time: '18mins away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy7', name: 'Bmx Sport', transmission: 'Manual', seats: 1, fuel: 'Human', distance: '4.5km', time: '22mins away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy8', name: 'Tandem Bike', transmission: 'Manual', seats: 2, fuel: 'Human', distance: '5.0km', time: '25mins away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy9', name: 'Eco Cruiser', transmission: 'Manual', seats: 1, fuel: 'Human', distance: '5.8km', time: '28mins away', image: require('../../assets/images/cycle_transparent.png') },
        { id: 'cy10', name: 'Advanced E-Bike', transmission: 'Automatic', seats: 1, fuel: 'Electric', distance: '6.5km', time: '32mins away', image: require('../../assets/images/cycle_transparent.png') },
    ],
};

export default function AvailableCarsScreen() {
    const { transportType } = useLocalSearchParams();
    const currentTransportType = (transportType as string) || 'Car';
    const vehicles = transportData[currentTransportType] || transportData['Car'];

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
                    <Text style={tw`text-gray-400 mt-1`}>{vehicles.length} found</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                    {vehicles.map((vehicle) => (
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
                                <MaterialCommunityIcons 
                                    name={
                                        currentTransportType === 'Car' ? 'car' :
                                        currentTransportType === 'Bike' ? 'motorbike' :
                                        currentTransportType === 'Cycle' ? 'bicycle' :
                                        currentTransportType === 'Taxi' ? 'taxi' : 'car'
                                    } 
                                    size={80} 
                                    color="#10B981" 
                                    style={tw`-mr-2`}
                                />
                            </View>

                            <Pressable
                                onPress={() => router.push({
                                    pathname: '/(pages)/car-details',
                                    params: { carId: vehicle.id, name: vehicle.name, transportType: currentTransportType }
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
