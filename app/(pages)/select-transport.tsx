import React from 'react';
import { View, Text, Pressable, Image, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const transportationModes = [
    { id: '1', name: 'Car', image: require('../../assets/images/Car.png') },
    { id: '2', name: 'Bike', image: require('../../assets/images/Bike.png') },
    { id: '3', name: 'Cycle', image: require('../../assets/images/Cycle.png') },
    { id: '4', name: 'Taxi', image: require('../../assets/images/Taxi.png') },
];

export default function SelectTransportScreen() {
    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1 px-6`}>
                <View style={tw`flex-row items-center justify-between py-4`}>
                    <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color="#374151" />
                        <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                    </Pressable>
                    <Text style={tw`text-xl font-bold text-gray-800`}>Select transport</Text>
                    <View style={tw`w-10`} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                    <Text style={tw`text-3xl font-extrabold text-gray-700 text-center mt-8 mb-10`}>
                        Select your transport
                    </Text>

                    <View style={tw`flex-row flex-wrap justify-between`}>
                        {transportationModes.map((mode) => (
                            <Pressable
                                key={mode.id}
                                onPress={() => router.push({
                                    pathname: '/(pages)/available-cars',
                                    params: { transportType: mode.name }
                                })}
                                style={tw`w-[47%] bg-[#E6F7F1]/50 border border-[#10B981]/20 rounded-2xl p-6 mb-6 items-center`}
                            >
                                <Image
                                    source={mode.image}
                                    style={tw`w-24 h-24 mb-4`}
                                    resizeMode="contain"
                                />
                                <Text style={tw`text-xl font-bold text-gray-700`}>{mode.name}</Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
