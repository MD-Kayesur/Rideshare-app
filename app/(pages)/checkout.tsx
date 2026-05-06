import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { usePaymentSheet } from '@stripe/stripe-react-native';
import { useCreatePaymentIntentMutation } from '../../redux/features/payment/paymentApi';

export default function CheckoutScreen() {
    const { amount, rideId } = useLocalSearchParams();
    const [createPaymentIntent, { isLoading: isCreatingIntent }] = useCreatePaymentIntentMutation();
    const { initPaymentSheet, presentPaymentSheet, loading: stripeLoading } = usePaymentSheet();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        initializePayment();
    }, []);

    const initializePayment = async () => {
        try {
            const res = await createPaymentIntent({
                rideId,
                gateway: 'stripe'
            }).unwrap();

            if (res.success && res.data.clientSecret) {
                const { error } = await initPaymentSheet({
                    merchantDisplayName: "Rideshare App",
                    paymentIntentClientSecret: res.data.clientSecret,
                    defaultBillingDetails: {
                        name: 'User Name',
                    },
                    allowsDelayedPaymentMethods: false,
                });

                if (!error) {
                    setIsReady(true);
                } else {
                    Alert.alert("Error", error.message);
                }
            }
        } catch (error: any) {
            console.error("Payment init error:", error);
            Alert.alert("Error", error?.data?.message || "Failed to initialize payment");
        }
    };

    const handlePayment = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert(
                "Payment Successful",
                "Your ride has been paid successfully!",
                [
                    { 
                        text: "OK", 
                        onPress: () => {
                            router.replace({
                                pathname: '/(pages)/request-rent',
                                params: { rideId }
                            });
                        }
                    }
                ]
            );
        }
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
                    <View style={tw`bg-[#10B981] rounded-3xl p-8 mb-8 shadow-lg items-center`}>
                        <Text style={tw`text-white/80 text-lg mb-2`}>Total Amount</Text>
                        <Text style={tw`text-white text-5xl font-black`}>${amount || '220.00'}</Text>
                        <View style={tw`flex-row items-center mt-6 bg-white/20 px-4 py-2 rounded-full`}>
                            <Ionicons name="shield-checkmark" size={16} color="white" />
                            <Text style={tw`text-white text-sm ml-2 font-bold`}>Secure Stripe Checkout</Text>
                        </View>
                    </View>

                    <View style={tw`bg-gray-50 rounded-3xl p-6 border border-gray-100`}>
                        <Text style={tw`text-gray-800 font-bold text-lg mb-4`}>Trip Summary</Text>
                        <View style={tw`flex-row justify-between mb-3`}>
                            <Text style={tw`text-gray-500`}>Ride Fare</Text>
                            <Text style={tw`text-gray-800 font-bold`}>${amount}</Text>
                        </View>
                        <View style={tw`flex-row justify-between mb-3`}>
                            <Text style={tw`text-gray-500`}>Booking Fee</Text>
                            <Text style={tw`text-gray-800 font-bold`}>$0.00</Text>
                        </View>
                        <View style={tw`h-[1px] bg-gray-200 my-3`} />
                        <View style={tw`flex-row justify-between`}>
                            <Text style={tw`text-gray-800 font-bold text-lg`}>Total</Text>
                            <Text style={tw`text-[#10B981] font-bold text-lg`}>${amount}</Text>
                        </View>
                    </View>

                    {!isReady && !isCreatingIntent && (
                        <Pressable 
                            onPress={initializePayment}
                            style={tw`mt-8 p-4 bg-gray-100 rounded-2xl items-center`}
                        >
                            <Text style={tw`text-gray-500 font-bold`}>Retry Initialization</Text>
                        </Pressable>
                    )}
                </ScrollView>

                {/* Bottom Action */}
                <View style={tw`px-6 py-6 border-t border-gray-50`}>
                    <Pressable
                        onPress={handlePayment}
                        disabled={!isReady || stripeLoading}
                        style={tw`bg-[#10B981] h-16 rounded-2xl items-center justify-center shadow-lg ${(!isReady || stripeLoading) ? 'opacity-50' : ''}`}
                    >
                        {isCreatingIntent || stripeLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={tw`text-white font-bold text-xl`}>Confirm Payment</Text>
                        )}
                    </Pressable>
                    {!isReady && (isCreatingIntent || stripeLoading) && (
                        <Text style={tw`text-center text-gray-400 text-xs mt-2`}>Preparing secure payment sheet...</Text>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}
