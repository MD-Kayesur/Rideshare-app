import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StatusBar, TextInput, DeviceEventEmitter, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';

const transactions = [
    { id: '1', name: 'Welton', date: 'Today at 09:20 am', amount: '-$570.00', type: 'out' },
    { id: '2', name: 'Nathsam', date: 'Today at 09:20 am', amount: '$570.00', type: 'in' },
    { id: '3', name: 'Welton', date: 'Today at 09:20 am', amount: '-$570.00', type: 'out' },
    { id: '4', name: 'Nathsam', date: 'Today at 09:20 am', amount: '$570.00', type: 'in' },
    { id: '5', name: 'Nathsam', date: 'Today at 09:20 am', amount: '$570.00', type: 'in' },
];

const paymentMethods = [
    { id: '1', type: 'visa', label: '**** **** **** 8970', expires: 'Expires: 12/26', icon: 'cc-visa' },
    { id: '2', type: 'mastercard', label: '**** **** **** 8970', expires: 'Expires: 12/26', icon: 'cc-mastercard' },
    { id: '3', type: 'paypal', label: 'mailaddress@mail.com', expires: 'Expires: 12/26', icon: 'paypal' },
    { id: '4', type: 'cash', label: 'Cash', expires: 'Expires: 12/26', icon: 'money' },
];

export default function WalletScreen() {
    const [viewStep, setViewStep] = useState<'main' | 'add_money' | 'add_method'>('main');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('1');
    const [amount, setAmount] = useState('');

    const toggleSidebar = (open: boolean) => {
        DeviceEventEmitter.emit('toggleSidebar', open);
    };

    const handleBack = () => {
        if (viewStep === 'add_money') setViewStep('main');
        else if (viewStep === 'add_method') setViewStep('add_money');
    };

    if (viewStep === 'add_money' || viewStep === 'add_method') {
        return (
            <View style={tw`flex-1 bg-white`}>
                <SafeAreaView style={tw`flex-1`}>
                    {/* Header */}
                    <View style={tw`flex-row items-center px-6 py-4`}>
                        <Pressable onPress={handleBack} style={tw`flex-row items-center`}>
                            <Ionicons name="chevron-back" size={24} color="#374151" />
                            <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                        </Pressable>
                        <Text style={tw`text-xl font-bold text-gray-800 flex-1 text-center mr-10`}>Amount</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-6 pt-6 pb-32`}>
                        {viewStep === 'add_money' ? (
                            <>
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
                                    onPress={() => setViewStep('add_method')}
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
                                            <FontAwesome name={method.icon as any} size={28} color={method.type === 'visa' ? '#1A1F71' : method.type === 'mastercard' ? '#EB001B' : method.type === 'paypal' ? '#0070BA' : '#4B5563'} />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`text-gray-800 font-bold text-base`}>{method.label}</Text>
                                            <Text style={tw`text-gray-400 text-xs mt-0.5`}>{method.expires}</Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </>
                        ) : (
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
                                    onPress={() => setViewStep('add_money')}
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
                        )}
                    </ScrollView>

                    {viewStep === 'add_money' && (
                        <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-100`}>
                            <Pressable
                                onPress={() => setModalVisible(true)}
                                style={tw`bg-[#10B981] py-4.5 rounded-2xl items-center shadow-lg`}
                            >
                                <Text style={tw`text-white font-bold text-xl`}>Confirm</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Success Modal */}
                    {modalVisible && (
                        <View style={tw`absolute inset-0 bg-black/50 items-center justify-center z-50 px-6`}>
                            <View style={tw`bg-white w-full rounded-[32px] p-6 shadow-2xl relative`}>
                                <Pressable
                                    onPress={() => setModalVisible(false)}
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
                                    <Text style={tw`text-4xl font-bold text-gray-800`}>$220</Text>
                                </View>
                                <Pressable
                                    onPress={() => { setModalVisible(false); setViewStep('main'); }}
                                    style={tw`bg-[#10B981] w-full py-4.5 rounded-2xl items-center mb-2`}
                                >
                                    <Text style={tw`text-white font-bold text-lg`}>Back Home</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row justify-between items-center px-6 py-4 mb-4`}>
                    <Pressable
                        onPress={() => toggleSidebar(true)}
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
                        onPress={() => setViewStep('add_money')}
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
}
