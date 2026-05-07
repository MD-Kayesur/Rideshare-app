import React from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import tw from 'twrnc';
import { paymentMethods } from "./constants";

interface AddMoneyProps {
    amount: string;
    setAmount: (val: string) => void;
    selectedPayment: string;
    setSelectedPayment: (val: string) => void;
    onAddMethod: () => void;
    onBack: () => void;
    onConfirm: () => void;
}

export const AddMoney: React.FC<AddMoneyProps> = ({
    amount,
    setAmount,
    selectedPayment,
    setSelectedPayment,
    onAddMethod,
    onBack,
    onConfirm
}) => {
    return (
        <View style={tw`flex-1 bg-white`}>
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row items-center px-6 py-4`}>
                    <Pressable onPress={onBack} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color="#374151" />
                        <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                    </Pressable>
                    <Text style={tw`text-xl font-bold text-gray-800 flex-1 text-center mr-10`}>Amount</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-6 pt-6 pb-32`}>
                    <View style={tw`bg-white border border-gray-100 rounded-2xl px-4 py-5 mb-4 shadow-sm`}>
                        <TextInput
                            placeholder="Enter Amount"
                            style={tw`text-lg text-gray-800`}
                            placeholderTextColor="#D1D5DB"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                    <Pressable
                        onPress={onAddMethod}
                        style={tw`self-end mb-8`}
                    >
                        <Text style={tw`text-blue-600 font-bold text-base`}>Add payment Method</Text>
                    </Pressable>

                    <Text style={tw`text-xl font-bold text-gray-800 mb-6`}>Select Payment Method</Text>
                    {paymentMethods.map((method) => (
                        <Pressable
                            key={method.id}
                            onPress={() => setSelectedPayment(method.id)}
                            style={tw`flex-row items-center bg-white border ${selectedPayment === method.id ? 'border-[#10B981]' : 'border-gray-100'} rounded-2xl p-5 mb-4 shadow-sm`}
                        >
                            <View style={tw`w-12 h-10 items-center justify-center mr-4`}>
                                <FontAwesome 
                                    name={method.icon as any} 
                                    size={28} 
                                    color={method.type === 'visa' ? '#1A1F71' : method.type === 'mastercard' ? '#EB001B' : method.type === 'paypal' ? '#0070BA' : '#4B5563'} 
                                />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-800 font-bold text-base`}>{method.label}</Text>
                                <Text style={tw`text-gray-400 text-xs mt-0.5`}>{method.expires}</Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>

                <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-100 pb-20`}>
                    <Pressable
                        onPress={onConfirm}
                        style={tw`bg-[#10B981] py-4.5 rounded-2xl items-center shadow-lg`}
                    >
                        <Text style={tw`text-white font-bold text-xl`}>Confirm</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
};
