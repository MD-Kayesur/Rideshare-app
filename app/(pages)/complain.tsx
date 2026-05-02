import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, StatusBar, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useCreateComplaintMutation } from '../../redux/features/driver/driverApi';

export default function ComplainScreen() {
    const [subject, setSubject] = useState('Vehicle not clean');
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const mutationResult = useCreateComplaintMutation ? useCreateComplaintMutation() : [null, { isLoading: false }];
    const [createComplaint, { isLoading }] = mutationResult as any;

    if (!useCreateComplaintMutation) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#4ADE80" />
            </View>
        );
    }

    const subjects = [
        'Vehicle not clean',
        'Driver behavior',
        'Late arrival',
        'Incorrect fare',
        'Safety concern',
        'Other'
    ];

    const handleSubmit = async () => {
        if (!message.trim()) {
            Alert.alert("Error", "Please provide more details in the message field");
            return;
        }

        try {
            await createComplaint({ subject, message }).unwrap();
            Alert.alert("Success", "Your complaint has been submitted.");
            router.back();
        } catch (error: any) {
            Alert.alert("Error", error?.data?.message || "Failed to submit complaint");
        }
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`px-6 py-4 flex-row items-center justify-between`}>
                    <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                        <Text style={tw`text-lg font-bold text-gray-800 ml-1`}>Back</Text>
                    </Pressable>
                    <Text style={tw`text-2xl font-black text-[#1F2937]`}>Complain</Text>
                    <View style={tw`w-10`} /> {/* Spacer */}
                </View>

                <ScrollView style={tw`flex-1 px-6 pt-10`}>
                    {/* Custom Dropdown */}
                    <View style={tw`mb-6`}>
                        <Pressable 
                            onPress={() => setIsDropdownOpen(true)}
                            style={tw`flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-5`}
                        >
                            <Text style={tw`text-lg text-gray-600 font-medium`}>{subject}</Text>
                            <Ionicons name="chevron-down" size={24} color="#333" />
                        </Pressable>
                    </View>

                    {/* Message Input */}
                    <View style={tw`mb-10`}>
                        <View style={tw`bg-white border border-gray-200 rounded-2xl px-5 py-4`}>
                            <TextInput
                                placeholder="Write your message here..."
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                numberOfLines={8}
                                textAlignVertical="top"
                                style={tw`text-lg text-gray-800 h-60`}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Submit Button */}
                <View style={tw`px-6 pb-10`}>
                    <Pressable
                        onPress={handleSubmit}
                        disabled={isLoading}
                        style={tw`bg-[#4ADE80] py-4.5 rounded-2xl items-center shadow-md ${isLoading ? 'opacity-70' : ''}`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={tw`text-white font-bold text-xl`}>Submit</Text>
                        )}
                    </Pressable>
                </View>

                {/* Dropdown Modal */}
                <Modal
                    visible={isDropdownOpen}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setIsDropdownOpen(false)}
                >
                    <TouchableOpacity 
                        style={tw`flex-1 bg-black/30 justify-center items-center px-10`}
                        onPress={() => setIsDropdownOpen(false)}
                    >
                        <View style={tw`bg-white w-full rounded-3xl p-6`}>
                            <Text style={tw`text-xl font-bold mb-4 text-gray-800`}>Select Subject</Text>
                            {subjects.map((item, index) => (
                                <Pressable 
                                    key={index}
                                    onPress={() => {
                                        setSubject(item);
                                        setIsDropdownOpen(false);
                                    }}
                                    style={tw`py-4 border-b border-gray-50`}
                                >
                                    <Text style={tw`text-lg ${subject === item ? 'text-[#4ADE80] font-bold' : 'text-gray-600'}`}>
                                        {item}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        </View>
    );
}
