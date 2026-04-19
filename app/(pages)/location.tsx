import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from 'expo-location'; // 1. Import expo-location
import tw from 'twrnc';

export default function LocationPermissionScreen() {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            // 1. Request foreground permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission denied');
                return;
            }

            // 2. Start watching the position
            // This will update the location state whenever the user moves
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,   // Update every 1 second
                    distanceInterval: 1,  // Update every 1 meter
                },
                (loc) => {
                    // Set the location state with the coordinates object
                    setLocation(loc.coords);
                }
            );
        })();
    }, []);

    const handleLocationPermission = async () => {
        setLoading(true);
        try {
            // Request permission
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    "Permission Denied",
                    "We need location access to find requests near you. You can enable it in settings."
                );
                setLoading(false);
                return;
            }

            // Optional: Get current position once to "verify" it works before moving on
            await Location.getCurrentPositionAsync({});

            // 3. Navigate to the next screen if successful
            router.push("/(auth)/welcome");
        } catch (error) {
            Alert.alert("Error", "Something went wrong while fetching location.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-200`}>
            <StatusBar barStyle="dark-content" />

            <View style={[tw`absolute inset-0 bg-gray-100`, { opacity: 0.5 }]}>
                <View style={[tw`absolute inset-0`, {
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    opacity: 0.2,
                    width: '100%',
                    height: '100%',
                    borderStyle: 'dashed'
                }]} />
            </View>

            <SafeAreaView style={tw`flex-1 items-center justify-center px-8`}>
                <View style={tw`bg-white rounded-[24px] p-10 items-center w-full shadow-2xl`}>

                    <View style={tw`items-center justify-center mb-10`}>
                        <View style={tw`w-24 h-24 bg-[#10B981]/10 rounded-full items-center justify-center`}>
                            <View style={tw`w-16 h-16 bg-[#10B981]/20 rounded-full items-center justify-center`}>
                                <View style={tw`w-12 h-12 bg-[#10B981] rounded-full items-center justify-center`}>
                                    <View style={tw`w-2 h-2 bg-white rounded-full`} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-4`}>
                        Enable your location
                    </Text>

                    <Text style={tw`text-base text-gray-400 text-center leading-relaxed mb-6`}>
                        Choose your location to start find the request around you
                    </Text>

                    {/* Display coordinates if location is available */}
                    {location && (
                        <View style={tw`bg-gray-50 p-4 rounded-xl w-full mb-6 border border-gray-100`}>
                            <Text style={tw`text-sm font-semibold text-gray-700 mb-1`}>Current Location:</Text>
                            <Text style={tw`text-xs text-gray-500 font-mono`}>Latitude: {location.latitude}</Text>
                            <Text style={tw`text-xs text-gray-500 font-mono`}>Longitude: {location.longitude}</Text>
                            <Text style={tw`text-xs text-gray-500 font-mono`}>Accuracy: {location.accuracy.toFixed(2)}m</Text>
                        </View>
                    )}

                    {errorMsg && (
                        <View style={tw`bg-red-50 p-4 rounded-xl w-full mb-6 border border-red-100`}>
                            <Text style={tw`text-xs text-red-500 font-medium text-center`}>{errorMsg}</Text>
                        </View>
                    )}

                     

                    <Pressable
                        onPress={handleLocationPermission} // 4. Attach the logic here
                        disabled={loading}
                        style={tw`flex-row w-full mb-6 items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}
                    // style={({ pressed }) => [
                    //     tw`bg-[#10B981] w-full py-5 rounded-xl items-center mb-6`,
                    //     (pressed || loading) && tw`opacity-90`
                    // ]}
                    >
                        <Text style={tw`text-black font-bold text-lg`}>
                            {loading ? "Processing..." : "Use my location"}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.push("/(auth)/welcome")}
                        style={tw`flex-row w-full items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}
                    // style={({ pressed }) => [
                    //     tw`py-2`,
                    //     pressed && tw`opacity-60`
                    // ]}
                    >
                        <Text style={tw`text-gray-400 font-medium text-lg`}>Skip for now</Text>
                    </Pressable>
                    
                </View>
            </SafeAreaView>
        </View>
    );
}




// import { View, Text, Pressable, Image, StatusBar } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import tw from 'twrnc';

// export default function LocationPermissionScreen() {
//     return (
//         <View style={tw`flex-1 bg-gray-200`}>
//             <StatusBar barStyle="dark-content" />

//             {/* Background Aesthetic (Replacing missing map asset) */}
//             <View style={[tw`absolute inset-0 bg-gray-100`, { opacity: 0.5 }]}>
//                 {/* Simulated Grid Pattern */}
//                 <View style={[tw`absolute inset-0`, {
//                     borderWidth: 1,
//                     borderColor: '#e5e7eb',
//                     opacity: 0.2,
//                     width: '100%',
//                     height: '100%',
//                     borderStyle: 'dashed'
//                 }]} />
//             </View>

//             <SafeAreaView style={tw`flex-1 items-center justify-center px-8`}>
//                 <View style={tw`bg-white rounded-[24px] p-10 items-center w-full shadow-2xl`}>
//                     {/* Location Icon with Ripples */}
//                     <View style={tw`items-center justify-center mb-10`}>
//                         <View style={tw`w-24 h-24 bg-[#10B981]/10 rounded-full items-center justify-center`}>
//                             <View style={tw`w-16 h-16 bg-[#10B981]/20 rounded-full items-center justify-center`}>
//                                 <View style={tw`w-12 h-12 bg-[#10B981] rounded-full items-center justify-center`}>
//                                     <View style={tw`w-2 h-2 bg-white rounded-full`} />
//                                 </View>
//                             </View>
//                         </View>
//                     </View>

//                     <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-4`}>
//                         Enable your location
//                     </Text>

//                     <Text style={tw`text-base text-gray-400 text-center leading-relaxed mb-10`}>
//                         Choose your location to start find the request around you
//                     </Text>

//                     <Pressable
//                         onPress={() => router.push("/(auth)/welcome")}
//                         style={({ pressed }) => [
//                             tw`bg-[#10B981] w-full py-5 rounded-xl items-center mb-6`,
//                             pressed && tw`opacity-90`
//                         ]}
//                     >
//                         <Text style={tw`text-white font-bold text-lg`}>Use my location</Text>
//                     </Pressable>

//                     <Pressable
//                         onPress={() => router.push("/(auth)/welcome")}
//                         style={({ pressed }) => [
//                             tw`py-2`,
//                             pressed && tw`opacity-60`
//                         ]}
//                     >
//                         <Text style={tw`text-gray-400 font-medium text-lg`}>Skip for now</Text>
//                     </Pressable>
//                 </View>
//             </SafeAreaView>
//         </View>
//     );
// }
