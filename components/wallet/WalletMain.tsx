import React from "react";
import { View, Text, Pressable, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';
import { transactions } from "./constants";

interface WalletMainProps {
    onAddMoney: () => void;
    onToggleSidebar: (open: boolean) => void;
}

export const WalletMain: React.FC<WalletMainProps> = ({ onAddMoney, onToggleSidebar }) => {
    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row justify-between items-center px-6 py-4 mb-4`}>
                    <Pressable
                        onPress={() => onToggleSidebar(true)}
                        style={tw`w-12 h-12 bg-[#10B981]/20 rounded-xl items-center justify-center`}
                    >
                        <Ionicons name="menu" size={28} color="#10B981" />
                    </Pressable>
                    <Pressable style={tw`w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm`}>
                        <Ionicons name="notifications-outline" size={26} color="#374151" />
                    </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-28 px-6`}>
                    {/* Add Money Button */}
                    <Pressable
                        onPress={onAddMoney}
                        style={tw`self-end border border-[#10B981]/30 rounded-xl py-4 px-8 mb-8`}
                    >
                        <Text style={tw`text-[#10B981] font-bold text-lg`}>Add Money</Text>
                    </Pressable>

                    {/* Balance Information Cards */}
                    <View style={tw`flex-row justify-between mb-10`}>
                        <View style={tw`w-[48%] aspect-square bg-[#E6F7F1]/50 border border-[#10B981]/10 rounded-3xl p-6 items-center justify-center shadow-sm`}>
                            <Text style={tw`text-4xl font-bold text-gray-800 mb-2`}>$500</Text>
                            <Text style={tw`text-gray-500 font-medium text-sm text-center`}>Available Balance</Text>
                        </View>
                        <View style={tw`w-[48%] aspect-square bg-[#E6F7F1]/50 border border-[#10B981]/10 rounded-3xl p-6 items-center justify-center shadow-sm`}>
                            <Text style={tw`text-4xl font-bold text-gray-800 mb-2`}>$200</Text>
                            <Text style={tw`text-gray-500 font-medium text-sm text-center`}>Total Expend</Text>
                        </View>
                    </View>

                    {/* Transactions */}
                    <View style={tw`flex-row justify-between items-center mb-6`}>
                        <Text style={tw`text-xl font-bold text-gray-800`}>Transactions</Text>
                        <Pressable>
                            <Text style={tw`text-[#10B981] font-bold`}>See All</Text>
                        </Pressable>
                    </View>

                    {transactions.map((tx) => (
                        <View key={tx.id} style={tw`flex-row items-center bg-white border border-gray-50 rounded-2xl p-4 mb-4 shadow-sm`}>
                            <View style={tw`w-12 h-12 rounded-full ${tx.type === 'out' ? 'bg-red-100' : 'bg-green-100'} items-center justify-center mr-4`}>
                                <MaterialCommunityIcons
                                    name={tx.type === 'out' ? "arrow-top-right" : "check"}
                                    size={24}
                                    color={tx.type === 'out' ? "#EF4444" : "#10B981"}
                                />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-lg font-bold text-gray-800 mb-0.5`}>{tx.name}</Text>
                                <Text style={tw`text-gray-400 text-sm`}>{tx.date}</Text>
                            </View>
                            <Text style={tw`text-lg font-bold ${tx.type === 'out' ? 'text-gray-800' : 'text-gray-800'}`}>{tx.amount}</Text>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};
