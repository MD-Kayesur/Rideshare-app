import React from 'react';
import { View, Text, Pressable, Image, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function CarDetailsScreen() {
    const { carId, name } = useLocalSearchParams();

    const specs = [
        { icon: 'lightning-bolt', label: 'Max. power', value: '2500hp' },
        { icon: 'gas-station', label: 'Fuel', value: '10km per litre' },
        { icon: 'speedometer', label: 'Max. speed', value: '230kph' },
        { icon: 'timer-outline', label: '0-60mph', value: '2.5sec' },
    ];

    const features = [
        { label: 'Model', value: 'GT5000' },
        { label: 'Capacity', value: '760hp' },
        { label: 'Color', value: 'Red' },
        { label: 'Fuel type', value: 'Octane' },
        { label: 'Gear type', value: 'Automatic' },
    ];

    // Map car name or type to images
    const vehicleImages: any = {
        'BMW Cabrio': require('../../assets/images/bmw_cabrio.png'),
        'Mustang Shelby GT': require('../../assets/images/mustang.png'),
        'BMW i8': require('../../assets/images/bmw_i8.png'),
        'Jaguar Silber': require('../../assets/images/jaguar.png'),
        'Yellow Cab NYC': require('../../assets/images/taxi_render.png'),
        'Executive Taxi': require('../../assets/images/taxi_render.png'),
        'Yamaha R1M': require('../../assets/images/motorcycle_render.png'),
        'Scooter Pro': require('../../assets/images/motorcycle_render.png'),
        'City Hybrid': require('../../assets/images/bicycle_render.png'),
        'Electric Cycle': require('../../assets/images/bicycle_render.png'),
    };

    const currentImage = vehicleImages[name as string] || vehicleImages['Mustang Shelby GT'];

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center px-6 py-4`}>
                    <Ionicons name="chevron-back" size={24} color="#374151" />
                    <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                </Pressable>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-32 px-6`}>
                    <View style={tw`mt-4`}>
                        <Text style={tw`text-3xl font-bold text-gray-800`}>{name || 'Mustang Shelby GT'}</Text>
                        <View style={tw`flex-row items-center mt-2`}>
                            <Ionicons name="star" size={18} color="#FBBF24" />
                            <Text style={tw`ml-1 text-gray-800 font-medium`}>4.9 <Text style={tw`text-gray-400 font-normal`}>(531 reviews)</Text></Text>
                        </View>
                    </View>

                    {/* Car Gallery */}
                    <View style={tw`flex-row items-center justify-between mt-8 mb-4`}>
                        <Pressable style={tw`p-2`}>
                            <Ionicons name="chevron-back" size={24} color="#374151" />
                        </Pressable>
                        <Image
                            source={currentImage}
                            style={tw`w-72 h-44`}
                            resizeMode="contain"
                        />
                        <Pressable style={tw`p-2`}>
                            <Ionicons name="chevron-forward" size={24} color="#374151" />
                        </Pressable>
                    </View>

                    {/* Specifications */}
                    <Text style={tw`text-xl font-bold text-gray-800 mt-6 mb-4`}>Specifications</Text>
                    <View style={tw`flex-row flex-wrap justify-between`}>
                        {specs.map((spec, index) => (
                            <View key={index} style={tw`w-[22%] aspect-square bg-white border border-[#10B981]/20 rounded-xl items-center justify-center p-2 mb-4`}>
                                <MaterialCommunityIcons name={spec.icon as any} size={24} color="#6B7280" />
                                <Text style={tw`text-[9px] text-gray-400 mt-1 text-center`}>{spec.label}</Text>
                                <Text style={tw`text-[10px] font-bold text-gray-700 text-center`}>{spec.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Car Features */}
                    <Text style={tw`text-xl font-bold text-gray-800 mt-4 mb-4`}>Car features</Text>
                    {features.map((feature, index) => (
                        <View key={index} style={tw`flex-row justify-between items-center bg-[#E6F7F1]/30 border border-[#10B981]/10 rounded-xl px-4 py-4 mb-3`}>
                            <Text style={tw`text-gray-500 font-medium`}>{feature.label}</Text>
                            <Text style={tw`text-gray-800 font-bold`}>{feature.value}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Bottom Actions */}
                <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-100 flex-row gap-4`}>
                    <Pressable
                        style={tw`flex-1 bg-white border border-[#10B981] py-4 rounded-xl items-center`}
                    >
                        <Text style={tw`text-[#10B981] font-bold text-lg`}>Book later</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push({
                            pathname: '/(pages)/request-rent',
                            params: { name: name }
                        })}
                        style={tw`flex-1 bg-[#10B981] py-4 rounded-xl items-center shadow-md`}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Ride Now</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}
