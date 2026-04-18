import React from "react";
import { View, Text, Pressable, ScrollView, StatusBar, DeviceEventEmitter, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

const offers = [
    { id: '1', discount: '15% off', title: 'Black Friday' },
    { id: '2', discount: '5% off', title: 'Christmas' },
    { id: '3', discount: '15% off', title: 'Happy New Year' },
    { id: '4', discount: '15% off', title: 'Black Friday' },
    { id: '5', discount: '5% off', title: 'Christmas' },
    { id: '6', discount: '15% off', title: 'Happy New Year' },
    { id: '7', discount: '15% off', title: 'Black Friday' },
    { id: '8', discount: '5% off', title: 'Christmas' },
    { id: '9', discount: '15% off', title: 'Summer Sale' },
    { id: '10', discount: '10% off', title: 'Flash Deal' },
    { id: '11', discount: '20% off', title: 'Special Promo' },
    { id: '12', discount: '15% off', title: 'Weekend Offer' },
    { id: '13', discount: '5% off', title: 'Member Reward' },
];

export default function OfferScreen() {
    const toggleSidebar = (open: boolean) => {
        DeviceEventEmitter.emit('toggleSidebar', open);
    };

    const handleCollect = (title: string) => {
        Alert.alert("Success", `${title} offer collected successfully!`);
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row items-center px-6 py-4 mb-2`}>
                    <Pressable
                        onPress={() => toggleSidebar(true)}
                        style={tw`w-12 h-12 bg-[#10B981]/10 rounded-xl items-center justify-center`}
                    >
                        <Ionicons name="menu" size={28} color="#10B981" />
                    </Pressable>
                    <Text style={tw`flex-1 text-2xl font-bold text-gray-800 text-center mr-12`}>Offer</Text>
                </View>

                {/* List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`px-6 pb-24`}
                >
                    {offers.map((offer) => (
                        <View
                            key={offer.id}
                            style={tw`flex-row items-center justify-between bg-white border border-[#10B981]/20 rounded-2xl p-5 mb-4 shadow-sm`}
                        >
                            <View>
                                <Text style={tw`text-xl font-bold text-orange-500 mb-1`}>{offer.discount}</Text>
                                <Text style={tw`text-gray-400 text-base`}>{offer.title}</Text>
                            </View>

                            <Pressable
                                onPress={() => handleCollect(offer.title)}
                                style={tw`bg-[#10B981] px-8 py-3.5 rounded-xl shadow-sm`}
                            >
                                <Text style={tw`text-white font-bold text-lg`}>Collect</Text>
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
