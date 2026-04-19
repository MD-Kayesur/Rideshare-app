import React, { useState, useRef } from "react";
import { View, Text, Pressable, TextInput, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function PhoneVerificationScreen() {
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== '' && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`px-6 pt-2 flex-row items-center`}>
                <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                    <Text style={tw`text-lg text-gray-800 ml-1`}>Back</Text>
                </Pressable>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1 px-8 pt-12`}
            >
                <Text style={tw`text-3xl font-bold text-gray-800 text-center mb-4`}>
                    Phone verification
                </Text>
                <Text style={tw`text-base text-gray-400 text-center mb-10`}>
                    Enter your OTP code
                </Text>

                {/* OTP Input Boxes */}
                <View style={tw`flex-row justify-between mb-10`}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputRefs.current[index] = ref; }}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={tw`w-14 h-14 border border-gray-200 rounded-xl text-center text-2xl font-bold bg-white`}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                <View style={tw`flex-row justify-center mb-auto`}>
                    <Text style={tw`text-gray-400 text-base`}>Didn't receive code? </Text>
                    <Pressable>
                        <Text style={tw`text-[#10B981] text-base font-bold`}>Resend again</Text>
                    </Pressable>
                </View>

                {/* Verify Button */}
                <Pressable
                    onPress={() => router.push("/(auth)/password")}
                    style={({ pressed }) => [
                        tw`bg-[#10B981] py-4 rounded-xl items-center mb-10`,
                        pressed && tw`opacity-90`
                    ]}
                >
                    <Text style={tw`text-white font-bold text-lg`}>Verify</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
