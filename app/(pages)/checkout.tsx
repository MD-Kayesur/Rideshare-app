import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function CheckoutScreen() {
    const { amount, rideId } = useLocalSearchParams();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');

    const handlePayment = () => {
        if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
            Alert.alert("Error", "Please fill in all card details");
            return;
        }
        
        // Mock payment process
        Alert.alert(
            "Payment Successful",
            "Your payment has been processed successfully.",
            [
                { 
                    text: "OK", 
                    onPress: () => {
                        if (rideId) {
                            router.replace({
                                pathname: '/(pages)/request-rent',
                                params: { rideId }
                            });
                        } else {
                            router.replace('/(tabs)');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row items-center px-6 py-4`}>
                    <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                        <Ionicons name="chevron-back" size={24} color="#374151" />
                    </Pressable>
                    <Text style={tw`text-xl font-bold text-gray-800 flex-1 text-center mr-8`}>Checkout</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-6 pb-10`}>
                    {/* Amount Card */}
                    <View style={tw`bg-[#10B981] rounded-3xl p-6 mb-8 shadow-lg`}>
                        <Text style={tw`text-white/80 text-sm mb-1`}>Total Amount</Text>
                        <Text style={tw`text-white text-4xl font-bold`}>${amount || '220.00'}</Text>
                        <View style={tw`flex-row items-center mt-4 bg-white/20 self-start px-3 py-1 rounded-full`}>
                            <Ionicons name="shield-checkmark" size={14} color="white" />
                            <Text style={tw`text-white text-xs ml-1 font-medium`}>Secure Payment</Text>
                        </View>
                    </View>

                    {/* Card Preview */}
                    <View style={tw`bg-gray-900 rounded-3xl p-6 mb-8 h-48 justify-between shadow-xl`}>
                        <View style={tw`flex-row justify-between items-center`}>
                            <MaterialCommunityIcons name="chip" size={40} color="#FBBF24" />
                            <FontAwesome name="cc-visa" size={32} color="white" />
                        </View>
                        <View>
                            <Text style={tw`text-white text-xl tracking-widest font-bold mb-2`}>
                                {cardNumber ? cardNumber.replace(/\d{4}(?=.)/g, '$& ') : '**** **** **** ****'}
                            </Text>
                            <View style={tw`flex-row justify-between items-end`}>
                                <View>
                                    <Text style={tw`text-white/50 text-[10px] uppercase`}>Card Holder</Text>
                                    <Text style={tw`text-white text-sm font-bold`}>{cardHolder || 'FULL NAME'}</Text>
                                </View>
                                <View>
                                    <Text style={tw`text-white/50 text-[10px] uppercase`}>Expires</Text>
                                    <Text style={tw`text-white text-sm font-bold`}>{expiryDate || 'MM/YY'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Inputs */}
                    <View style={tw`gap-5`}>
                        <View>
                            <Text style={tw`text-gray-500 font-bold mb-2 ml-1`}>Card Holder Name</Text>
                            <TextInput
                                placeholder="MD KAYESUR RAHMAN"
                                placeholderTextColor="#9CA3AF"
                                value={cardHolder}
                                onChangeText={setCardHolder}
                                style={tw`bg-gray-50 border border-gray-100 rounded-2xl h-14 px-5 text-gray-800 font-bold`}
                            />
                        </View>

                        <View>
                            <Text style={tw`text-gray-500 font-bold mb-2 ml-1`}>Card Number</Text>
                            <View style={tw`relative`}>
                                <TextInput
                                    placeholder="0000 0000 0000 0000"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="number-pad"
                                    maxLength={16}
                                    value={cardNumber}
                                    onChangeText={setCardNumber}
                                    style={tw`bg-gray-50 border border-gray-100 rounded-2xl h-14 px-5 text-gray-800 font-bold`}
                                />
                                <FontAwesome name="credit-card" size={20} color="#10B981" style={tw`absolute right-5 top-4`} />
                            </View>
                        </View>

                        <View style={tw`flex-row gap-4`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-500 font-bold mb-2 ml-1`}>Expiry Date</Text>
                                <TextInput
                                    placeholder="MM/YY"
                                    placeholderTextColor="#9CA3AF"
                                    maxLength={5}
                                    value={expiryDate}
                                    onChangeText={setExpiryDate}
                                    style={tw`bg-gray-50 border border-gray-100 rounded-2xl h-14 px-5 text-gray-800 font-bold`}
                                />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-500 font-bold mb-2 ml-1`}>CVV</Text>
                                <TextInput
                                    placeholder="***"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="number-pad"
                                    maxLength={3}
                                    secureTextEntry
                                    value={cvv}
                                    onChangeText={setCvv}
                                    style={tw`bg-gray-50 border border-gray-100 rounded-2xl h-14 px-5 text-gray-800 font-bold`}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Action */}
                <View style={tw`px-6 py-6 border-t border-gray-50`}>
                    <Pressable
                        onPress={handlePayment}
                        style={tw`bg-[#10B981] h-16 rounded-2xl items-center justify-center shadow-lg`}
                    >
                        <Text style={tw`text-white font-bold text-xl`}>Pay Now</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}
