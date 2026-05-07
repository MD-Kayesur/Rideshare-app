import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Image, Dimensions, DeviceEventEmitter, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Region, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from 'expo-location';
import tw from 'twrnc';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
    const mapRef = useRef<MapView>(null);
    const [mode, setMode] = useState<'transport' | 'delivery'>('transport');
    const [flowState, setFlowState] = useState<'none' | 'selecting' | 'confirming'>('none');
    const [locations, setLocations] = useState({ from: '', to: '' });
    const [region, setRegion] = useState<Region | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setIsLoading(false);
                    return;
                }

                // Explicitly request high accuracy for the first fetch
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.BestForNavigation,
                });
                
                const initialRegion = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.060,
                    longitudeDelta: 0.070,
                };
                
                setRegion(initialRegion);
                // Force map to jump to real location instantly
                setTimeout(() => {
                    mapRef.current?.animateToRegion(initialRegion, 1000);
                }, 500);
                
                setIsLoading(false);
            } catch (error) {
                console.log("Location fetch failed:", error);
                setIsLoading(false);
            }
        })();
    }, []);

    const moveToCurrentLocation = async () => {
        setIsLoading(true);
        let location = await Location.getCurrentPositionAsync({});
        const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.060,
            longitudeDelta: 0.070,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        setIsLoading(false);
    };

    const [currentAddress, setCurrentAddress] = useState('Finding your location...');

    useEffect(() => {
        if (region) {
            (async () => {
                try {
                    let result = await Location.reverseGeocodeAsync({
                        latitude: region.latitude,
                        longitude: region.longitude
                    });
                    if (result.length > 0) {
                        const addr = result[0];
                        const fullAddress = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`;
                        setCurrentAddress(fullAddress.trim() || 'Custom Location');
                    }
                } catch (e) {
                    console.log("Reverse geocode error:", e);
                }
            })();
        }
    }, [region]);

    const toggleSidebar = (open: boolean) => {
        DeviceEventEmitter.emit('toggleSidebar', open);
    };

    const [recentPlaces, setRecentPlaces] = useState<any[]>([]);
    const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const fetchNearbyPlaces = async (lat: number, lon: number) => {
        try {
            // Fetch real nearby points of interest using Nominatim
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=cafe,restaurant,store&lat=${lat}&lon=${lon}&addressdetails=1&limit=6`);
            const data = await response.json();
            
            const places = data.map((item: any, index: number) => ({
                id: item.place_id.toString(),
                name: item.display_name.split(',')[0],
                address: item.display_name,
                distance: `${(index + 1) * 0.5}km`, // Mocked distance for UI
                coordinate: {
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon)
                }
            }));
            
            setRecentPlaces(places);
            setFilteredPlaces(places);
        } catch (error) {
            console.log("Error fetching nearby places:", error);
        }
    };

    useEffect(() => {
        if (region && recentPlaces.length === 0) {
            fetchNearbyPlaces(region.latitude, region.longitude);
        }
    }, [region]);

    const handleSearch = async (text: string) => {
        setLocations(l => ({ ...l, to: text }));
        
        if (text.length > 2) {
            setIsSearching(true);
            try {
                // Using OpenStreetMap Nominatim API for free real-world suggestions
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&addressdetails=1&limit=5`);
                const data = await response.json();
                
                const suggestions = data.map((item: any) => ({
                    id: item.place_id.toString(),
                    name: item.display_name.split(',')[0],
                    address: item.display_name,
                    distance: 'Search Result',
                    coordinate: {
                        latitude: parseFloat(item.lat),
                        longitude: parseFloat(item.lon)
                    }
                }));
                
                setFilteredPlaces(suggestions);
            } catch (error) {
                console.log("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        } else if (text.length === 0) {
            setFilteredPlaces(recentPlaces);
        }
    };

    const renderBottomSheet = () => {
        if (flowState === 'none') return null;

        return (
            <View style={[tw`absolute bottom-20 left-0 right-0 bg-white rounded-t-[40px] shadow-2xl z-50`, { height: flowState === 'selecting' ? '70%' : '50%' }]}>
                {/* Drag Handle */}
                <View style={tw`items-center py-4`}>
                    <View style={tw`w-16 h-1.5 bg-gray-200 rounded-full`} />
                </View>

                {/* Close Button */}
                <Pressable
                    onPress={() => setFlowState('none')}
                    style={tw`absolute right-8 top-8 z-10`}
                >
                    <Ionicons name="close" size={24} color="#333" />
                </Pressable>

                <View style={tw`px-6 flex-1`}>
                    <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-8`}>Select address</Text>

                    {flowState === 'selecting' && (
                        <View style={tw`flex-1 pb-10`}>
                            {/* Input Fields */}
                            <View style={tw`gap-4 mb-8`}>
                                <View style={tw`flex-row items-center border border-[#10B981] rounded-2xl px-5 py-4 bg-[#F0FDF4]`}>
                                    <Ionicons name="navigate-outline" size={24} color="#10B981" style={tw`mr-4`} />
                                    <TextInput
                                        placeholder="Current location"
                                        style={tw`flex-1 text-lg text-[#10B981] font-bold`}
                                        placeholderTextColor="#9CA3AF"
                                        value={currentAddress}
                                        editable={false}
                                    />
                                    <Ionicons name="navigate" size={20} color="#EF4444" />
                                </View>
                                <View style={tw`flex-row items-center border border-gray-100 rounded-2xl px-5 py-4 bg-white shadow-sm`}>
                                    <Ionicons name="location-outline" size={24} color="#9CA3AF" style={tw`mr-4`} />
                                    <TextInput
                                        placeholder="Where would you go?"
                                        style={tw`flex-1 text-lg text-gray-800`}
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={handleSearch}
                                        value={locations.to}
                                    />
                                </View>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={tw`flex-row justify-between items-center mb-6`}>
                                    <Text style={tw`text-gray-400 font-bold`}>
                                        {locations.to.length > 2 ? "Suggestions" : "Nearby locations"}
                                    </Text>
                                    {isSearching && <ActivityIndicator size="small" color="#10B981" />}
                                </View>
                                {filteredPlaces.map(place => (
                                    <Pressable
                                        key={place.id}
                                        onPress={() => {
                                            setLocations(prev => ({ ...prev, to: place.name }));
                                            setFlowState('confirming');
                                            
                                            // Animate map to selected location if coordinates exist
                                            if (place.coordinate) {
                                                mapRef.current?.animateToRegion({
                                                    ...place.coordinate,
                                                    latitudeDelta: 0.01,
                                                    longitudeDelta: 0.01,
                                                }, 1000);
                                            }
                                        }}
                                        style={tw`flex-row items-center mb-8`}
                                    >
                                        <View style={tw`w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-4`}>
                                            <Ionicons name="location" size={24} color="#9CA3AF" />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex-row justify-between items-center mb-1`}>
                                                <Text style={tw`text-lg font-bold text-gray-800`}>{place.name}</Text>
                                                <Text style={tw`text-gray-400 font-medium`}>{place.distance}</Text>
                                            </View>
                                            <Text style={tw`text-gray-400 text-sm`}>{place.address}</Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {flowState === 'confirming' && (
                        <View style={tw`flex-1 pb-12`}>
                            <View style={tw`bg-gray-50 rounded-3xl p-6 mb-10`}>
                                <View style={tw`flex-row items-start mb-8`}>
                                    <View style={tw`items-center mr-4`}>
                                        <Ionicons name="location" size={24} color="#EF4444" />
                                        <View style={tw`w-0.5 h-12 border-l border-dashed border-[#10B981] my-1`} />
                                    </View>
                                    <View>
                                        <Text style={tw`text-lg font-bold text-gray-800`}>Current location</Text>
                                        <Text style={tw`text-gray-400 text-sm`}>{currentAddress}</Text>
                                    </View>
                                </View>
                                <View style={tw`flex-row items-start`}>
                                    <View style={tw`items-center mr-4`}>
                                        <Ionicons name="location" size={24} color="#10B981" />
                                    </View>
                                    <View>
                                        <Text style={tw`text-lg font-bold text-gray-800`}>{locations.to}</Text>
                                        <Text style={tw`text-gray-400 text-sm`}>1901 Thornridge Cir. Shiloh, Hawaii 81063</Text>
                                    </View>
                                    <Text style={tw`ml-auto text-gray-400 font-medium`}>1.1km</Text>
                                </View>
                            </View>

                            <Pressable
                                onPress={() => router.push({
                                    pathname: "/(pages)/select-transport",
                                    params: { mode: mode }
                                })}
                                style={tw`bg-[#10B981] py-5 rounded-2xl items-center shadow-lg shadow-[#10B981]/30 w-full`}
                            >
                                <Text style={tw`text-white font-bold text-xl`}>Confirm Location</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Map Background */}
            <View style={tw`absolute inset-0 bg-gray-50`}>
                {region ? (
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_DEFAULT}
                        style={StyleSheet.absoluteFill}
                        initialRegion={region}
                        onRegionChange={() => setIsMoving(true)}
                        onRegionChangeComplete={(r) => {
                            setRegion(r);
                            setIsMoving(false);
                        }}
                        showsUserLocation={true}
                    />
                ) : (
                    <View style={tw`flex-1 items-center justify-center`}>
                        <ActivityIndicator size="large" color="#10B981" />
                    </View>
                )}

                {/* Pulsating Center Pin */}
                {region && (
                    <View style={[styles.markerFixed, tw`items-center justify-center`]} pointerEvents="none">
                        <View style={tw`w-40 h-40 rounded-full bg-[#10B981]/10 items-center justify-center`}>
                            <View style={tw`w-20 h-20 rounded-full bg-[#10B981]/20 items-center justify-center`}>
                                <View style={tw`w-8 h-8 rounded-full bg-white shadow-lg items-center justify-center`}>
                                    <Ionicons 
                                        name="location" 
                                        size={20} 
                                        color="#1F2937" 
                                        style={{ transform: [{ translateY: isMoving ? -5 : 0 }] }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <SafeAreaView style={tw`flex-1`} pointerEvents="box-none">
                <View style={tw`flex-1 px-6 pt-4`} pointerEvents="box-none">
                    {/* Top Bar */}
                    <View style={tw`flex-row justify-between items-center mb-6`}>
                        <Pressable
                            onPress={() => toggleSidebar(true)}
                            style={tw`w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-lg`}
                        >
                            <Ionicons name="menu" size={28} color="#10B981" />
                        </Pressable>
                        <Pressable
                            onPress={() => router.push("/(pages)/notifications")}
                            style={tw`w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg`}
                        >
                            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
                        </Pressable>
                    </View>

                    {/* Search and Toggle Container - Visible only when NOT selecting */}
                    {flowState === 'none' && (
                        <View style={tw`mt-auto mb-10 bg-[#10B981]/10 p-5 rounded-[32px] border border-white shadow-2xl`}>
                            {/* Search Bar Container */}
                            <View style={tw`relative mb-6`}>
                                <Pressable
                                    onPress={() => setFlowState('selecting')}
                                    style={tw`flex-row items-center bg-white rounded-2xl px-5 py-4 shadow-sm`}
                                >
                                    <Ionicons name="search" size={24} color="#9CA3AF" style={tw`mr-4`} />
                                    <Text style={tw`flex-1 text-lg text-gray-400 font-medium`}>Where would you go?</Text>
                                    <Ionicons name="heart-outline" size={24} color="#D1D5DB" />
                                </Pressable>
                                
                                {/* Locate Me Button */}
                                <Pressable 
                                    onPress={moveToCurrentLocation}
                                    style={tw`absolute -right-2 -top-2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-50`}
                                >
                                    <MaterialCommunityIcons name="target" size={24} color="#1F2937" />
                                </Pressable>
                            </View>

                            {/* Transport/Delivery Toggle */}
                            <View style={tw`flex-row bg-white/50 rounded-2xl p-1.5`}>
                                <Pressable
                                    onPress={() => setMode('transport')}
                                    style={tw`flex-1 py-4.5 rounded-xl items-center ${mode === 'transport' ? 'bg-[#10B981] shadow-lg shadow-[#10B981]/20' : ''}`}
                                >
                                    <Text style={tw`font-bold text-xl ${mode === 'transport' ? 'text-white' : 'text-gray-500'}`}>Transport</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setMode('delivery')}
                                    style={tw`flex-1 py-4.5 rounded-xl items-center ${mode === 'delivery' ? 'bg-[#10B981] shadow-lg shadow-[#10B981]/20' : ''}`}
                                >
                                    <Text style={tw`font-bold text-xl ${mode === 'delivery' ? 'text-white' : 'text-gray-500'}`}>Delivery</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </View>
            </SafeAreaView>

            {/* Address Selection Bottom Sheet */}
            {renderBottomSheet()}
        </View>
    );
}

const styles = StyleSheet.create({
    markerFixed: {
        left: '50%',
        marginLeft: -80, // Half of w-40 (40 * 4 / 2)
        marginTop: -80,
        position: 'absolute',
        top: '50%',
        zIndex: 10,
    }
});
