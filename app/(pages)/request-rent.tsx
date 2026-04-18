import React, { useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, TextInput, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const paymentMethods = [
    { id: '1', type: 'visa', label: '**** **** **** 8970', expires: 'Expires: 12/26', icon: 'cc-visa' },
    { id: '2', type: 'mastercard', label: '**** **** **** 8970', expires: 'Expires: 12/26', icon: 'cc-mastercard' },
    { id: '3', type: 'paypal', label: 'mailaddress@mail.com', expires: 'Expires: 12/26', icon: 'paypal' },
    { id: '4', type: 'cash', label: 'Cash', expires: 'Expires: 12/26', icon: 'money' },
];

export default function RequestRentScreen() {
    const { name } = useLocalSearchParams();
    const [selectedPayment, setSelectedPayment] = useState('1');
    const [step, setStep] = useState(0); // 0: Details (Date/Time), 1: Charge, 2: Success

    const carDisplayName = typeof name === 'string' ? name : Array.isArray(name) ? name[0] : 'Mustang Shelby GT';
    const carFirstName = carDisplayName.split(' ')[0];

    // Map car name or type to images
    const vehicleImages: any = {
        'BMW Cabrio': require('../../assets/images/bmw_cabrio.png'),
        'Mustang Shelby GT': require('../../assets/images/mustang.png'),
        'BMW i8': require('../../assets/images/bmw_i8.png'),
        'Jaguar Silber': require('../../assets/images/jaguar.png'),
        'Yellow Cab NYC': require('../../assets/images/taxi_render.png'),
        'Executive Taxi': require('../../assets/images/taxi_render.png'),
        'Yamaha R1M': require('../../assets/images/motorcycle_render.png'),
        'Scooter Pro': require('../../assets/images/motorcycle_render.png'),
        'City Hybrid': require('../../assets/images/bicycle_render.png'),
        'Electric Cycle': require('../../assets/images/bicycle_render.png'),
    };

    const currentImage = vehicleImages[name as string] || vehicleImages['Mustang Shelby GT'];

    const handleNextStep = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            router.dismissAll();
            router.replace('/(tabs)');
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        } else {
            router.back();
        }
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row items-center px-6 py-4`}>
                    <Pressable onPress={handleBack} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color="#374151" />
                        <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                    </Pressable>
                    {step !== 2 && (
                        <Text style={tw`text-xl font-bold text-gray-800 flex-1 text-center mr-10`}>Request for rent</Text>
                    )}
                </View>

                {step === 2 ? (
                    /* Step 2: Thank You */
                    <View style={tw`flex-1 items-center justify-center -mt-20 px-10`}>
                        <View style={tw`w-32 h-32 items-center justify-center mb-10`}>
                            <MaterialCommunityIcons name="decagram" size={140} color="#E6F7F1" style={tw`absolute`} />
                            <Ionicons name="checkmark" size={60} color="#10B981" style={tw`z-10`} />
                        </View>
                        <Text style={tw`text-3xl font-bold text-gray-800 mb-4`}>Thank you</Text>
                        <Text style={tw`text-gray-500 text-center text-lg leading-6`}>
                            Your booking has been placed sent to{"\n"}Md. Sharif Ahmed
                        </Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-32 px-6`}>
                        {/* Route Info */}
                        <View style={tw`mt-6 mb-8`}>
                            <View style={tw`flex-row items-start mb-6`}>
                                <View style={tw`items-center mr-4 pt-1`}>
                                    <Ionicons name="location" size={24} color="#EF4444" />
                                    <View style={tw`w-0.5 h-10 border-l border-dashed border-[#10B981] my-1`} />
                                </View>
                                <View>
                                    <Text style={tw`text-lg font-bold text-gray-800`}>Current location</Text>
                                    <Text style={tw`text-gray-400 text-sm`}>2972 Westheimer Rd. Santa Ana, Illinois 85486</Text>
                                </View>
                            </View>
                            <View style={tw`flex-row items-start`}>
                                <View style={tw`items-center mr-4`}>
                                    <Ionicons name="location" size={24} color="#10B981" />
                                </View>
                                <View style={tw`flex-1 flex-row justify-between items-center`}>
                                    <View>
                                        <Text style={tw`text-lg font-bold text-gray-800`}>Office</Text>
                                        <Text style={tw`text-gray-400 text-sm`}>1901 Thornridge Cir. Shiloh, Hawaii 81063</Text>
                                    </View>
                                    <Text style={tw`text-gray-800 font-bold`}>1.1km</Text>
                                </View>
                            </View>
                        </View>

                        {/* Car Summary */}
                        <View style={tw`bg-[#E6F7F1]/50 border border-[#10B981]/10 rounded-2xl p-4 flex-row items-center mb-8 shadow-sm`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{carDisplayName}</Text>
                                <View style={tw`flex-row items-center`}>
                                    <Ionicons name="star" size={16} color="#FBBF24" />
                                    <Text style={tw`ml-1 text-gray-800 font-medium text-xs`}>4.9 <Text style={tw`text-gray-400 font-normal`}>(531 reviews)</Text></Text>
                                </View>
                            </View>
                            <Image source={currentImage} style={tw`w-24 h-14`} resizeMode="contain" />
                        </View>

                        {step === 0 ? (
                            /* Step 0: Date & Time Inputs */
                            <View style={tw`gap-4 mb-8`}>
                                <View style={tw`bg-white border border-gray-200 rounded-xl px-4 py-4`}>
                                    <TextInput placeholder="Date" style={tw`text-base text-gray-800`} placeholderTextColor="#D1D5DB" />
                                </View>
                                <View style={tw`bg-white border border-gray-200 rounded-xl px-4 py-4`}>
                                    <TextInput placeholder="Time" style={tw`text-base text-gray-800`} placeholderTextColor="#D1D5DB" />
                                </View>
                            </View>
                        ) : (
                            /* Step 1: Charge Section */
                            <View style={tw`mt-2 mb-8`}>
                                <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Charge</Text>
                                <View style={tw`flex-row justify-between items-center mb-4`}>
                                    <Text style={tw`text-gray-500 font-medium text-lg`}>{carFirstName}/per hours</Text>
                                    <Text style={tw`text-gray-800 font-bold text-lg`}>$200</Text>
                                </View>
                                <View style={tw`flex-row justify-between items-center mb-2`}>
                                    <Text style={tw`text-gray-500 font-medium text-lg`}>Vat (5%)</Text>
                                    <Text style={tw`text-gray-800 font-bold text-lg`}>$20</Text>
                                </View>
                            </View>
                        )}

                        {/* Payment Method */}
                        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Select payment method</Text>
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
                    </ScrollView>
                )}

                {/* Bottom Action */}
                <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-100`}>
                    <Pressable
                        onPress={handleNextStep}
                        style={tw`bg-[#10B981] py-4.5 rounded-2xl items-center shadow-lg`}
                    >
                        <Text style={tw`text-white font-bold text-xl`}>
                            {step === 0 ? 'Confirm Booking' : 'Confirm Ride'}
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}
