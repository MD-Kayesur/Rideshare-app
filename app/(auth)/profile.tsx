import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Modal, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import tw from 'twrnc';

const CITY_OPTIONS = ["Dhaka", "Khulna", "Rajshahi", "Barisal", "Sylhet", "Chittagong", "Rangpur", "Mymensingh"];
const DISTRICT_OPTIONS = ["Dhaka", "Khulna", "Rajshahi", "Barisal", "Sylhet", "Chittagong", "Rangpur", "Mymensingh"];

export default function ProfileEditScreen() {
    const [selectedCity, setSelectedCity] = useState("Dhaka");
    const [selectedDistrict, setSelectedDistrict] = useState("Dhaka");
    const [showCityModal, setShowCityModal] = useState(false);
    const [showDistrictModal, setShowDistrictModal] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`px-6 pt-2 flex-row items-center justify-between`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg text-gray-800 ml-1`}>Back</Text>
                </Pressable>
                <Text style={tw`text-xl font-bold text-gray-800 mr-10`}>Profile</Text>
                <View style={tw`w-10`} />
            </View>

            <ScrollView style={tw`flex-1 px-8 pt-8`} showsVerticalScrollIndicator={false}>
                {/* Profile Picture */}
                <View style={tw`items-center mb-10`}>
                    <View style={tw`relative`}>
                        <View style={tw`w-32 h-32 bg-gray-200 rounded-full items-center justify-center overflow-hidden`}>
                            {image ? (
                                <Image source={{ uri: image }} style={tw`w-full h-full`} />
                            ) : (
                                <Ionicons name="person" size={60} color="#ccc" />
                            )}
                        </View>
                        <Pressable
                            onPress={pickImage}
                            style={tw`absolute bottom-0 right-0 bg-[#10B981] p-2 rounded-full border-4 border-white`}
                        >
                            <Ionicons name="camera" size={20} color="white" />
                        </Pressable>
                    </View>
                </View>

                <View style={tw`gap-5 pb-10`}>
                    {/* Full Name */}
                    <TextInput
                        placeholder="Full Name"
                        // defaultValue="Kayesur"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                    />

                    {/* Phone Input with Country Code */}
                    <View style={tw`flex-row items-center border border-gray-200 rounded-xl bg-white`}>
                        <Pressable style={tw`flex-row items-center px-4 py-4 border-r border-gray-200`}>
                            <Text style={tw`text-2xl mr-2`}>🇧🇩</Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </Pressable>
                        <View style={tw`flex-row items-center flex-1 px-4`}>
                            <Text style={tw`text-base text-gray-800 mr-2`}>+880</Text>
                            <TextInput
                                placeholder="Your mobile number"
                                // defaultValue="01926360430"
                                style={tw`flex-1 pb-2 text-base`}
                                placeholderTextColor="#ccc"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <TextInput
                        placeholder="Email"
                        // defaultValue="Kaeysr@gmail.com"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                        keyboardType="email-address"
                    />

                    {/* Street */}
                    <TextInput
                        placeholder="Street"
                        defaultValue="Asfsdfsdfssfg"
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                    />

                    {/* City Selection */}
                    <Pressable
                        onPress={() => setShowCityModal(true)}
                        style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white`}
                    >
                        <Text style={[tw`text-base`, selectedCity ? tw`text-gray-800` : tw`text-gray-300`]}>{selectedCity || "City"}</Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                    </Pressable>

                    {/* District Selection */}
                    <Pressable
                        onPress={() => setShowDistrictModal(true)}
                        style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white`}
                    >
                        <Text style={[tw`text-base`, selectedDistrict ? tw`text-gray-800` : tw`text-gray-300`]}>{selectedDistrict || "District"}</Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                    </Pressable>

                    {/* Buttons */}
                    <View style={tw`flex-row gap-4 mt-6`}>
                        <Pressable
                            onPress={() => router.back()}
                            style={({ pressed }) => [
                                tw`flex-1 border border-[#10B981] py-4 rounded-xl items-center`,
                                pressed && tw`bg-gray-50`
                            ]}
                        >
                            <Text style={tw`text-[#10B981] font-bold text-lg`}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => router.push("/(tabs)")}
                            
                            style={({ pressed }) => [
                                tw`flex-1 bg-[#10B981] py-4 rounded-xl items-center`,
                                pressed && tw`opacity-90`
                            ]}
                        >
                            <Text style={tw`text-black font-bold text-lg`}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            {/* City Modal */}
            <Modal
                visible={showCityModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCityModal(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowCityModal(false)}
                    style={tw`flex-1 bg-black/50 justify-center items-center px-8`}
                >
                    <View style={tw`bg-white w-full rounded-2xl p-4 max-h-[60%]`}>
                        <Text style={tw`text-xl font-bold text-gray-800 mb-4 text-center`}>Select City</Text>
                        <FlatList
                            data={CITY_OPTIONS}
                            keyExtractor={(item) => item}
                            renderItem={({ item, index }) => (
                                <Pressable
                                    onPress={() => {
                                        setSelectedCity(item);
                                        setShowCityModal(false);
                                    }}
                                    style={tw`py-4 border-b border-gray-100 ${index === CITY_OPTIONS.length - 1 ? 'border-b-0' : ''}`}
                                >
                                    <Text style={tw`text-lg text-gray-700 text-center`}>{item}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* District Modal */}
            <Modal
                visible={showDistrictModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDistrictModal(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowDistrictModal(false)}
                    style={tw`flex-1 bg-black/50 justify-center items-center px-8`}
                >
                    <View style={tw`bg-white w-full rounded-2xl p-4 max-h-[60%]`}>
                        <Text style={tw`text-xl font-bold text-gray-800 mb-4 text-center`}>Select District</Text>
                        <FlatList
                            data={DISTRICT_OPTIONS}
                            keyExtractor={(item) => item}
                            renderItem={({ item, index }) => (
                                <Pressable
                                    onPress={() => {
                                        setSelectedDistrict(item);
                                        setShowDistrictModal(false);
                                    }}
                                    style={tw`py-4 border-b border-gray-100 ${index === DISTRICT_OPTIONS.length - 1 ? 'border-b-0' : ''}`}
                                >
                                    <Text style={tw`text-lg text-gray-700 text-center`}>{item}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
