import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Modal, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import tw from 'twrnc';

const ComplainPage = () => {
    const [complain, setComplain] = useState("");
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState("Vehicle not clean");

    const handleSubmit = () => {
        if (complain.length >= 10) {
            setSuccessModalVisible(true);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`flex-grow`} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={tw`flex-row items-center px-6 py-4`}>
                        <Pressable onPress={() => router.back()} style={tw`flex-row items-center absolute left-6 z-10`}>
                            <Ionicons name="chevron-back" size={24} color="#333" />
                            <Text style={tw`text-lg font-medium text-gray-800 ml-1`}>Back</Text>
                        </Pressable>
                        <View style={tw`flex-1 items-center`}>
                            <Text style={tw`text-2xl font-bold text-gray-900`}>Complain</Text>
                        </View>
                    </View>

                    <View style={tw`px-6 mt-8`}>
                        {/* Selector */}
                        <Pressable style={tw`flex-row justify-between items-center border border-gray-300 rounded-xl px-4 py-5 mb-6`}>
                            <Text style={tw`text-lg text-gray-700`}>{selectedType}</Text>
                            <Ionicons name="chevron-down" size={24} color="#333" />
                        </Pressable>

                        {/* TextArea */}
                        <TextInput
                            style={[tw`border border-gray-300 rounded-xl px-4 py-4 text-lg text-gray-700 mb-8`, { height: 180, textAlignVertical: 'top' }]}
                            placeholder="Write your complain here (minimum 10 characters)"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={6}
                            value={complain}
                            onChangeText={setComplain}
                        />

                        {/* Submit Button */}
                        <Pressable
                            onPress={handleSubmit}
                            style={tw`bg-[#10B981] py-4 rounded-xl items-center shadow-lg ${complain.length < 10 ? 'opacity-70' : ''}`}
                            disabled={complain.length < 10}
                        >
                            <Text style={tw`text-white font-bold text-xl`}>Submit</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSuccessModalVisible}
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View style={tw`flex-1 justify-center items-center bg-black/50 px-6`}>
                    <View style={tw`bg-white w-full rounded-3xl p-8 items-center`}>
                        <Pressable
                            onPress={() => setSuccessModalVisible(false)}
                            style={tw`absolute right-6 top-6`}
                        >
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </Pressable>

                        <View style={tw`w-32 h-32 bg-[#E1F3ED] rounded-full items-center justify-center mb-6`}>
                            <View style={tw`w-24 h-24 bg-[#10B981]/20 rounded-full items-center justify-center`}>
                                <Ionicons name="checkmark" size={60} color="#10B981" />
                            </View>
                        </View>

                        <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Send successful</Text>
                        <Text style={tw`text-base text-gray-400 text-center mb-10`}>
                            Your complain has been send successful
                        </Text>

                        <Pressable
                            onPress={() => {
                                setSuccessModalVisible(false);
                                router.replace("/(tabs)");
                            }}
                            style={tw`bg-[#10B981] w-full py-4 rounded-xl items-center shadow-lg`}
                        >
                            <Text style={tw`text-white font-bold text-xl`}>Back Home</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ComplainPage;
