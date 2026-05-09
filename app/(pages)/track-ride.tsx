import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';
import { useGetSingleRideQuery } from '../../redux/features/ride/rideApi';

const { width, height } = Dimensions.get('window');

export default function TrackRideScreen() {
    const { rideId } = useLocalSearchParams();
    const mapRef = useRef<MapView>(null);
    
    const { data: rideResponse } = useGetSingleRideQuery(rideId as string, {
        skip: !rideId,
        pollingInterval: 5000,
    });
    const ride = rideResponse?.data || rideResponse;

    const [region] = useState({
        latitude: 23.8103,
        longitude: 90.4125,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    // Mock coordinates for polyline
    const coordinates = [
        { latitude: 23.8103, longitude: 90.4125 }, // Pickup
        { latitude: 23.7940, longitude: 90.4043 }, // Destination
    ];

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            
            {/* Map Section */}
            <View style={tw`flex-1`}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_DEFAULT}
                    style={StyleSheet.absoluteFill}
                    initialRegion={region}
                >
                    <Marker coordinate={coordinates[0]}>
                        <View style={tw`bg-white p-1 rounded-full shadow-lg`}>
                            <View style={tw`bg-[#10B981] p-1.5 rounded-full`}>
                                <Ionicons name="car" size={20} color="white" />
                            </View>
                        </View>
                    </Marker>
                    
                    <Marker coordinate={coordinates[1]}>
                        <View style={tw`bg-white p-1 rounded-full shadow-lg`}>
                            <View style={tw`bg-[#EF4444] p-1.5 rounded-full`}>
                                <Ionicons name="location" size={20} color="white" />
                            </View>
                        </View>
                    </Marker>

                    <Polyline
                        coordinates={coordinates}
                        strokeColor="#10B981"
                        strokeWidth={4}
                    />
                </MapView>

                {/* Floating Top Bar */}
                <SafeAreaView style={tw`absolute top-0 left-0 right-0 p-6 flex-row justify-between items-center`} pointerEvents="box-none">
                    <Pressable
                        onPress={() => toggleSidebar(true)}
                        style={tw`w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-lg`}
                    >
                        <Ionicons name="menu" size={28} color="#10B981" />
                    </Pressable>
                    <Pressable
                        style={tw`w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg`}
                    >
                        <Ionicons name="notifications" size={24} color="#1F2937" />
                    </Pressable>
                </SafeAreaView>
            </View>

            {/* Bottom Sheet */}
            <View style={tw`bg-white rounded-t-[40px] shadow-2xl p-6 pb-10`}>
                <View style={tw`w-16 h-1.5 bg-gray-200 rounded-full self-center mb-6`} />
                
                <Text style={tw`text-lg font-bold text-gray-700 mb-6`}>Your driver is coming in 3:35</Text>
                
                <View style={tw`h-[1px] bg-gray-100 mb-6`} />

                {/* Driver Info */}
                <View style={tw`flex-row items-center mb-8`}>
                    <Image 
                        source={ride?.driver?.avatar ? { uri: ride?.driver?.avatar } : require('../../assets/images/image.png')} 
                        style={tw`w-16 h-16 rounded-xl bg-blue-100`} 
                    />
                    <View style={tw`ml-4 flex-1`}>
                        <Text style={tw`text-xl font-bold text-gray-800`}>{ride?.driver?.name || "Sergio Ramasis"}</Text>
                        <View style={tw`flex-row items-center mt-1`}>
                            <Ionicons name="location" size={14} color="#9CA3AF" />
                            <Text style={tw`text-gray-400 text-sm ml-1`}>800m (5mins away)</Text>
                        </View>
                        <View style={tw`flex-row items-center mt-1`}>
                            <Ionicons name="star" size={14} color="#FBBF24" />
                            <Text style={tw`text-gray-800 font-bold text-xs ml-1`}>4.9 <Text style={tw`text-gray-400 font-normal`}>(531 reviews)</Text></Text>
                        </View>
                    </View>
                    <Image source={require('../../assets/images/mustang.png')} style={tw`w-24 h-14`} resizeMode="contain" />
                </View>

                {/* Payment Section */}
                <View style={tw`flex-row justify-between items-center mb-4`}>
                    <Text style={tw`text-gray-400 font-bold text-lg`}>Payment method</Text>
                    <Text style={tw`text-gray-800 font-black text-2xl`}>${ride?.fare || '220.00'}</Text>
                </View>

                <View style={tw`flex-row items-center bg-[#E6F7F1]/50 border border-[#10B981]/20 rounded-2xl p-4 mb-8`}>
                    <View style={tw`w-12 h-8 bg-black rounded-md items-center justify-center mr-4`}>
                        <FontAwesome name="cc-visa" size={20} color="white" />
                    </View>
                    <View>
                        <Text style={tw`text-gray-800 font-bold`}>**** **** **** 8970</Text>
                        <Text style={tw`text-gray-400 text-xs`}>Expires: 12/26</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" style={tw`ml-auto`} />
                </View>

                {/* Footer Buttons */}
                <View style={tw`flex-row gap-4 mb-4`}>
                    <Pressable 
                        style={tw`flex-1 h-14 border border-gray-200 rounded-2xl items-center justify-center`}
                    >
                        <Text style={tw`text-[#10B981] font-bold text-lg`}>Call</Text>
                    </Pressable>
                    <Pressable 
                        onPress={() => router.push({
                            pathname: '/(pages)/chat',
                            params: {
                                userId: ride?.driver?._id,
                                userName: ride?.driver?.name || "Sergio Ramasis",
                                userAvatar: ride?.driver?.avatar
                            }
                        })}
                        style={tw`flex-2 h-14 bg-[#10B981] rounded-2xl items-center justify-center shadow-lg shadow-[#10B981]/20`}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Message</Text>
                    </Pressable>
                </View>

                {/* New Proceed to Payment Button */}
                <Pressable 
                    onPress={() => router.push({
                        pathname: '/(pages)/checkout',
                        params: { 
                            amount: ride?.fare || '220.00',
                            rideId: ride?._id || rideId
                        }
                    })}
                    style={tw`w-full h-16 bg-black rounded-2xl items-center justify-center shadow-lg`}
                >
                    <Text style={tw`text-white font-bold text-xl`}>Proceed to Payment</Text>
                </Pressable>
            </View>
        </View>
    );
}

const toggleSidebar = (open: boolean) => {
    import('react-native').then(({ DeviceEventEmitter }) => {
        DeviceEventEmitter.emit('toggleSidebar', open);
    });
};
