import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    onBackHome: () => void;
    amount: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    onClose,
    onBackHome,
    amount
}) => {
    if (!visible) return null;

    return (
        <View style={tw`absolute inset-0 bg-black/50 items-center justify-center z-50 px-6`}>
            <View style={tw`bg-white w-full rounded-[32px] p-6 shadow-2xl relative`}>
                <Pressable
                    onPress={onClose}
                    style={tw`absolute top-4 right-4 z-10 p-2`}
                >
                    <Ionicons name="close" size={24} color="#9CA3AF" />
                </Pressable>
                <View style={tw`items-center mt-6 mb-8`}>
                    <View style={tw`w-24 h-24 items-center justify-center`}>
                        <MaterialCommunityIcons name="decagram" size={120} color="#E6F7F1" style={tw`absolute`} />
                        <Ionicons name="checkmark" size={54} color="#10B981" style={tw`z-10`} />
                    </View>
                </View>
                <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-2`}>Add Success</Text>
                <Text style={tw`text-gray-400 text-center text-base mb-10`}>Your money has been add successfully</Text>
                <View style={tw`items-center mb-10`}>
                    <Text style={tw`text-gray-500 font-bold text-sm mb-1`}>Amount</Text>
                    <Text style={tw`text-4xl font-bold text-gray-800`}>${amount || '0'}</Text>
                </View>
                <Pressable
                    onPress={onBackHome}
                    style={tw`bg-[#10B981] w-full py-4.5 rounded-2xl items-center mb-2`}
                >
                    <Text style={tw`text-white font-bold text-lg`}>Back Home</Text>
                </Pressable>
            </View>
        </View>
    );
};
