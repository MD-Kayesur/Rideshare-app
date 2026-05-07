import React, { useState } from "react";
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const methodOptions = [
        { label: 'Visa', icon: 'cc-visa' },
        { label: 'Mastercard', icon: 'cc-mastercard' },
        { label: 'Paypal', icon: 'paypal' },
        { label: 'Cash', icon: 'money' },
    ];

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
                        <View style={tw`relative z-50`}>
                            <Pressable 
                                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={tw`flex-row items-center justify-between border border-gray-200 rounded-2xl px-4 py-4 bg-white`}
                            >
                                <Text style={tw`${selectedType ? 'text-gray-800' : 'text-gray-400'} text-base`}>
                                    {selectedType || 'Select Payment Method'}
                                </Text>
                                <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#374151" />
                            </Pressable>

                            {isDropdownOpen && (
                                <View style={tw`absolute top-16 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden`}>
                                    {methodOptions.map((option, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => {
                                                setSelectedType(option.label);
                                                setIsDropdownOpen(false);
                                            }}
                                            style={tw`flex-row items-center px-4 py-4 border-b border-gray-50 last:border-b-0 active:bg-gray-50`}
                                        >
                                            <FontAwesome name={option.icon as any} size={20} color="#4B5563" style={tw`mr-3 w-6`} />
                                            <Text style={tw`text-gray-700 text-base`}>{option.label}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={tw`border border-gray-200 rounded-2xl px-4 py-4`}>
                            <TextInput
                                placeholder="Account Number"
                                style={tw`text-base text-gray-800`}
                                placeholderTextColor="#D1D5DB"
                            />
                        </View>

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

                        <View style={tw`mt-6 mb-10`}>
                            <Pressable
                                onPress={onSave}
                                style={tw`bg-[#10B981] py-4.5 rounded-2xl items-center shadow-lg`}
                            >
                                <Text style={tw`text-white font-bold text-lg`}>Save Payment Method</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};
