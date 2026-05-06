import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, ScrollView, Image, ActivityIndicator, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import { 
    useCreateDriverMutation, 
    useGetMyDriverProfileQuery, 
    useUpdateDriverProfileMutation, 
    useUploadImageMutation 
} from "../../redux/features/driver/driverApi";
import { useAddVehicleMutation } from "../../redux/features/vehicle/vehicleApi";

export default function AddVehicleScreen() {
    const { type = 'car' } = useLocalSearchParams<{ type: string }>();
    
    // API Hooks
    const { data: profileData, isLoading: isFetching } = useGetMyDriverProfileQuery({});
    const [createDriver, { isLoading: isCreating }] = useCreateDriverMutation();
    const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverProfileMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [addVehicle, { isLoading: isAdding }] = useAddVehicleMutation();

    // Form State
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [isAC, setIsAC] = useState(false);
    const [vehicleImage, setVehicleImage] = useState("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop");
    const [driverPhoto, setDriverPhoto] = useState("https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop");
    const [driverBio, setDriverBio] = useState("");

    useEffect(() => {
        if (profileData?.data) {
            const driver = profileData.data;
            setVehicleModel(driver.vehicleModel || "");
            setVehicleNumber(driver.vehicleNumber || "");
            setLicenseNumber(driver.licenseNumber || "");
            setIsAC(driver.details?.isAC || false);
            if (driver.vehicleImage) setVehicleImage(driver.vehicleImage);
            if (driver.driverPhoto) setDriverPhoto(driver.driverPhoto);
            setDriverBio(driver.driverBio || "");
        }
    }, [profileData]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setVehicleImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!vehicleModel.trim()) {
            Alert.alert("Error", "Vehicle model is required");
            return;
        }

        const payload = {
            vehicleType: type,
            vehicleModel,
            vehicleNumber: type !== 'cycle' ? vehicleNumber : undefined,
            licenseNumber: type !== 'cycle' ? licenseNumber : undefined,
            vehicleImage,
            details: type === 'car' ? { isAC } : {},
        };

        try {
            // First ensure driver profile exists
            if (!profileData?.data) {
                await createDriver({
                    vehicleType: type,
                    vehicleModel,
                    vehicleNumber,
                    licenseNumber,
                    vehicleImage,
                    driverPhoto,
                    driverBio,
                    details: type === 'car' ? { isAC } : {},
                }).unwrap();
            }

            // Then add to my vehicles list
            const res = await addVehicle(payload).unwrap();

            if (res.success) {
                Alert.alert("Success", "Vehicle added to your fleet!");
                router.push("/(pages)/my-cars");
            }
        } catch (error: any) {
            Alert.alert("Error", error?.data?.message || "Failed to add vehicle");
        }
    };

    if (isFetching) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <ActivityIndicator size="large" color="#10B981" />
            </View>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={tw`px-6 py-4 flex-row items-center border-b border-gray-50`}>
                <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </Pressable>
                <Text style={tw`text-xl font-bold text-gray-800 ml-2`}>
                    {profileData?.data ? 'Edit' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
            </View>

            <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                {/* Driver Profile Section */}
                <View style={tw`px-6 pt-4`}>
                    <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Driver Profile</Text>
                    <View style={tw`flex-row items-center bg-white border border-gray-100 rounded-3xl p-4 shadow-sm`}>
                        <View style={tw`relative`}>
                            <Image 
                                source={{ uri: driverPhoto }} 
                                style={tw`w-20 h-20 rounded-full bg-blue-100`} 
                            />
                            <Pressable 
                                onPress={async () => {
                                    const result = await ImagePicker.launchImageLibraryAsync({
                                        mediaTypes: ['images'],
                                        allowsEditing: true,
                                        aspect: [1, 1],
                                        quality: 0.8,
                                    });
                                    if (!result.canceled) setDriverPhoto(result.assets[0].uri);
                                }}
                                style={tw`absolute bottom-0 right-0 w-7 h-7 bg-[#10B981] rounded-full items-center justify-center border-2 border-white`}
                            >
                                <Ionicons name="camera" size={14} color="white" />
                            </Pressable>
                        </View>
                        <View style={tw`ml-4 flex-1`}>
                            <Text style={tw`text-sm font-bold text-gray-500 mb-2 ml-1`}>ABOUT ME</Text>
                            <TextInput 
                                placeholder="Tell riders about yourself..."
                                value={driverBio}
                                onChangeText={setDriverBio}
                                multiline
                                style={tw`bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2 h-16 text-sm text-gray-800`}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                {/* Vehicle Illustration/Image */}
                <View style={tw`px-6 py-6 items-center`}>
                    <Text style={tw`text-lg font-bold text-gray-800 mb-4 w-full`}>Vehicle Information</Text>
                    <View style={tw`w-full h-48 bg-[#F3F4F6] rounded-3xl overflow-hidden shadow-sm border border-gray-100`}>
                        <Image 
                            source={{ uri: vehicleImage }}
                            style={tw`w-full h-full`}
                            resizeMode="cover"
                        />
                        <Pressable 
                            style={tw`absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg`}
                            onPress={pickImage}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <ActivityIndicator color="#10B981" />
                            ) : (
                                <Ionicons name="camera" size={24} color="#10B981" />
                            )}
                        </Pressable>
                    </View>
                </View>

                <View style={tw`px-8 gap-6`}>
                    {/* Model Input */}
                    <View>
                        <Text style={tw`text-sm font-bold text-gray-500 mb-2 ml-1`}>VEHICLE MODEL</Text>
                        <View style={tw`flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-2xl px-4 py-1`}>
                            <Ionicons name="car-outline" size={24} color="#9CA3AF" style={tw`mr-3`} />
                            <TextInput
                                placeholder={`Enter ${type} model (e.g. Toyota Corolla)`}
                                value={vehicleModel}
                                onChangeText={setVehicleModel}
                                style={tw`flex-1 py-4 text-base text-gray-800`}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {type !== 'cycle' && (
                        <>
                            {/* Plate Number Input */}
                            <View>
                                <Text style={tw`text-sm font-bold text-gray-500 mb-2 ml-1`}>PLATE NUMBER</Text>
                                <View style={tw`flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-2xl px-4 py-1`}>
                                    <MaterialCommunityIcons name="numeric" size={24} color="#9CA3AF" style={tw`mr-3`} />
                                    <TextInput
                                        placeholder="Enter registration number"
                                        value={vehicleNumber}
                                        onChangeText={setVehicleNumber}
                                        style={tw`flex-1 py-4 text-base text-gray-800`}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>

                            {/* License Number Input */}
                            <View>
                                <Text style={tw`text-sm font-bold text-gray-500 mb-2 ml-1`}>DRIVING LICENSE</Text>
                                <View style={tw`flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-2xl px-4 py-1`}>
                                    <Ionicons name="card-outline" size={24} color="#9CA3AF" style={tw`mr-3`} />
                                    <TextInput
                                        placeholder="Enter your license number"
                                        value={licenseNumber}
                                        onChangeText={setLicenseNumber}
                                        style={tw`flex-1 py-4 text-base text-gray-800`}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    {/* Special Details for Car */}
                    {type === 'car' && (
                        <View style={tw`flex-row items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-2xl px-5 py-4 mt-2`}>
                            <View style={tw`flex-row items-center`}>
                                <MaterialCommunityIcons name="air-conditioner" size={24} color={isAC ? "#10B981" : "#9CA3AF"} style={tw`mr-3`} />
                                <Text style={tw`text-base font-medium text-gray-700`}>Air Conditioning (AC)</Text>
                            </View>
                            <Pressable 
                                onPress={() => setIsAC(!isAC)}
                                style={tw`w-14 h-8 rounded-full ${isAC ? 'bg-[#10B981]' : 'bg-gray-300'} p-1`}
                            >
                                <View style={tw`w-6 h-6 bg-white rounded-full ${isAC ? 'ml-auto' : ''} shadow-sm`} />
                            </Pressable>
                        </View>
                    )}

                    {/* Features Info */}
                    <View style={tw`bg-[#10B981]/5 border border-[#10B981]/10 rounded-2xl p-5 mt-4`}>
                        <View style={tw`flex-row items-center mb-2`}>
                            <Ionicons name="information-circle" size={20} color="#10B981" />
                            <Text style={tw`text-[#10B981] font-bold ml-2`}>Verification Required</Text>
                        </View>
                        <Text style={tw`text-gray-500 text-sm leading-5`}>
                            Your vehicle information will be reviewed by our team. Please ensure all details are accurate to avoid delays in activation.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Button */}
            <View style={tw`px-8 py-6 border-t border-gray-100`}>
                <Pressable
                    onPress={handleSave}
                    disabled={isCreating || isUpdating}
                    style={tw`bg-[#10B981] py-4 rounded-2xl items-center shadow-lg ${isCreating || isUpdating ? 'opacity-70' : ''}`}
                >
                    {isCreating || isUpdating ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={tw`text-white font-bold text-lg`}>
                            {profileData?.data ? 'Update' : 'Save'} Vehicle Details
                        </Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
