import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StatusBar, DeviceEventEmitter, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';

const initialFavorites = [
    { id: '1', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '2', title: 'Home', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '3', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '4', title: 'House', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '5', title: 'Home', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '6', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '7', title: 'House', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '8', title: 'House', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
];

export default function FavouritesScreen() {
    const [favorites, setFavorites] = useState(initialFavorites);

    const toggleSidebar = (open: boolean) => {
        DeviceEventEmitter.emit('toggleSidebar', open);
    };

    const handleRemove = (id: string, title: string) => {
        Alert.alert(
            "Remove Favourite",
            `Are you sure you want to remove ${title} from your favourites?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => setFavorites(favorites.filter(f => f.id !== id))
                }
            ]
        );
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row items-center px-6 py-4 mb-2`}>
                    <Pressable
                        onPress={() => toggleSidebar(true)}
                        style={tw`w-12 h-12 bg-[#10B981]/20 rounded-xl items-center justify-center`}
                    >
                        <Ionicons name="menu" size={28} color="#10B981" />
                    </Pressable>
                    <Text style={tw`flex-1 text-2xl font-bold text-gray-800 text-center mr-12`}>Favourite</Text>
                </View>

                {/* List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`px-6 pb-24`}
                >
                    {favorites.map((item) => (
                        <View
                            key={item.id}
                            style={tw`flex-row items-center bg-white border border-gray-50 rounded-2xl p-4 mb-4 shadow-sm`}
                        >
                            <View style={tw`w-12 h-12 items-center justify-center`}>
                                <FontAwesome name="map-marker" size={28} color="#374151" />
                            </View>

                            <View style={tw`flex-1 ml-2`}>
                                <Text style={tw`text-lg font-bold text-gray-800`}>{item.title}</Text>
                                <Text style={tw`text-gray-400 text-sm leading-5`}>{item.address}</Text>
                            </View>

                            <Pressable
                                onPress={() => handleRemove(item.id, item.title)}
                                style={tw`p-2`}
                            >
                                <Ionicons name="remove-circle" size={26} color="#E11D48" />
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
