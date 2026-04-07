import { View, Text, Pressable, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import tw from 'twrnc';

export default function LocationPermissionScreen() {
    return (
        <View style={tw`flex-1 bg-gray-200`}>
            <StatusBar barStyle="dark-content" />

            {/* Background Aesthetic (Replacing missing map asset) */}
            <View style={[tw`absolute inset-0 bg-gray-100`, { opacity: 0.5 }]}>
                {/* Simulated Grid Pattern */}
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
                    {/* Location Icon with Ripples */}
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

                    <Text style={tw`text-base text-gray-400 text-center leading-relaxed mb-10`}>
                        Choose your location to start find the request around you
                    </Text>

                    <Pressable
                        onPress={() => router.push("/(auth)/welcome")}
                        style={({ pressed }) => [
                            tw`bg-[#10B981] w-full py-5 rounded-xl items-center mb-6`,
                            pressed && tw`opacity-90`
                        ]}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Use my location</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.push("/(auth)/welcome")}
                        style={({ pressed }) => [
                            tw`py-2`,
                            pressed && tw`opacity-60`
                        ]}
                    >
                        <Text style={tw`text-gray-400 font-medium text-lg`}>Skip for now</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}
