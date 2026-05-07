import React from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import tw from 'twrnc';
import { paymentMethods } from "./constants";

interface AddMethodProps {
    onBack: () => void;
    onSave: () => void;
}

export const AddMethod: React.FC<AddMethodProps> = ({ onBack, onSave }) => {
    return (
        <View style={tw`flex-1 bg-white`}>
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row items-center px-6 py-4`}>
                    <Pressable onPress={onBack} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color="#374151" />
                        <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                    </Pressable>
                    <Text style={tw`text-xl font-bold text-gray-800 flex-1 text-center mr-10`}>Add Payment Method</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-6 pt-6 pb-10`}>
                    <View style={tw`gap-6`}>
                        <View style={tw`flex-row items-center justify-between border border-gray-200 rounded-2xl px-4 py-4`}>
                            <Text style={tw`text-gray-400 text-base`}>Select Payment Method</Text>
                            <Ionicons name="chevron-down" size={20} color="#374151" />
                        </View>
                        <View style={tw`border border-gray-200 rounded-2xl px-4 py-4`}>
                            <TextInput
                                placeholder="Account Number"
                                style={tw`text-base text-gray-800`}
                                placeholderTextColor="#D1D5DB"
                            />
                        </View>
                        <Pressable
                            onPress={onSave}
                            style={tw`bg-[#10B981]/40 py-4.5 rounded-2xl items-center shadow-sm`}
                        >
                            <Text style={tw`text-white font-bold text-lg`}>Save Payment Method</Text>
                        </Pressable>

                        <View style={tw`mt-4`}>
                            {paymentMethods.map((method) => (
                                <View
                                    key={method.id}
                                    style={tw`flex-row items-center bg-white border border-gray-100 opacity-50 rounded-2xl p-4 mb-4`}
                                >
                                    <View style={tw`w-12 h-10 items-center justify-center mr-4`}>
                                        <FontAwesome name={method.icon as any} size={28} color="#D1D5DB" />
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-gray-300 font-bold text-base`}>{method.label}</Text>
                                        <Text style={tw`text-gray-200 text-xs mt-0.5`}>{method.expires}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};
