import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationPickerScreen() {
    const mapRef = useRef<MapView>(null);
    const [region, setRegion] = useState<Region | null>(null);

    const [isMoving, setIsMoving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setIsLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 1000);
            setIsLoading(false);
        })();
    }, []);

    const moveToCurrentLocation = async () => {
        setIsLoading(true);
        let location = await Location.getCurrentPositionAsync({});
        const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
        setIsLoading(false);
    };

    const onRegionChangeComplete = (newRegion: Region) => {
        setRegion(newRegion);
        setIsMoving(false);
    };

    const onRegionChange = () => {
        if (!isMoving) setIsMoving(true);
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            {/* Map */}
            {region ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={region}
                    onRegionChange={onRegionChange}
                    onRegionChangeComplete={onRegionChangeComplete}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                />
            ) : (
                <View style={[styles.map, tw`bg-gray-50 items-center justify-center`]}>
                    {!isLoading && <Text style={tw`text-gray-400`}>Unable to load map without location</Text>}
                </View>
            )}

            {/* Fixed Center Marker */}
            {region && (
                <View style={styles.markerFixed} pointerEvents="none">
                    <View style={tw`items-center`}>
                        <View style={tw`bg-white p-1.5 rounded-2xl shadow-lg mb-1`}>
                            <View style={tw`bg-[#10B981] p-2 rounded-xl`}>
                                <MaterialCommunityIcons name="map-marker" size={24} color="white" />
                            </View>
                        </View>
                        <View style={[styles.markerPin, { transform: [{ translateY: isMoving ? -10 : 0 }] }]} />
                    </View>
                </View>
            )}

            {/* Overlay UI */}
            <SafeAreaView style={tw`absolute inset-0`} pointerEvents="box-none">
                {/* Header Controls */}
                <View style={tw`px-6 py-4 flex-row items-center justify-between`}>
                    <Pressable 
                        style={tw`w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-lg`}
                        onPress={() => {}} 
                    >
                        <Ionicons name="menu" size={24} color="#10B981" />
                    </Pressable>
                    <Pressable 
                        style={tw`w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg`}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#374151" />
                    </Pressable>
                </View>

                {/* Bottom Sheet UI */}
                <View style={tw`mt-auto bg-white rounded-t-[40px] shadow-2xl p-6 pb-12`}>
                    <View style={tw`w-16 h-1.5 bg-gray-200 rounded-full self-center mb-6`} />
                    
                    <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-8`}>Select address</Text>

                    <Pressable 
                        onPress={moveToCurrentLocation}
                        style={tw`flex-row items-center bg-[#E6F7F1] border border-[#10B981] rounded-2xl px-5 py-4 mb-4`}
                    >
                        <Ionicons name="navigate-outline" size={24} color="#10B981" style={tw`mr-4`} />
                        <Text style={tw`flex-1 text-[#10B981] font-bold text-lg`}>Current location</Text>
                        <Ionicons name="navigate" size={20} color="#EF4444" />
                    </Pressable>

                    <View style={tw`flex-row items-center bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-8 shadow-sm`}>
                        <Ionicons name="location-outline" size={24} color="#9CA3AF" style={tw`mr-4`} />
                        <Text style={tw`text-gray-400 text-lg`}>
                            {region ? "Current Selection" : "United States"}
                        </Text>
                    </View>

                    <Text style={tw`text-gray-400 font-bold mb-6`}>Recent places</Text>

                    <View style={tw`gap-6`}>
                        <View style={tw`flex-row items-center`}>
                            <View style={tw`w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-4`}>
                                <Ionicons name="location" size={24} color="#9CA3AF" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-800 font-bold text-lg`}>Office</Text>
                                <Text style={tw`text-gray-400 text-sm`}>2972 Westheimer Rd. Santa Ana...</Text>
                            </View>
                            <Text style={tw`text-gray-400 font-medium`}>2.7km</Text>
                        </View>

                        <Pressable 
                            style={tw`bg-[#10B981] py-5 rounded-2xl items-center shadow-lg shadow-[#10B981]/30 mt-4`}
                            disabled={!region}
                            onPress={() => {
                                if (region) console.log("Final Selected Location:", region);
                            }}
                        >
                            <Text style={tw`text-white font-bold text-xl`}>Confirm Location</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>

            {isLoading && (
                <View style={tw`absolute inset-0 bg-black/20 items-center justify-center z-50`}>
                    <View style={tw`bg-white p-6 rounded-3xl shadow-xl`}>
                        <ActivityIndicator size="large" color="#10B981" />
                        <Text style={tw`mt-4 text-gray-600 font-bold`}>Finding location...</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%',
        zIndex: 10,
    },
    markerPin: {
        width: 2,
        height: 15,
        backgroundColor: '#10B981',
    }
});
