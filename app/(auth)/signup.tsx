import { View, Text, Pressable, TextInput, StatusBar, ScrollView, Image, Alert, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from 'twrnc';
import React, { useState } from "react";
import { useRegisterMutation } from "../../redux/features/auth/authApi";

export default function SignUpScreen() {
    const [agreed, setAgreed] = useState(false);
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ name: "Bangladesh", flag: "🇧🇩", code: "+880" });
    const [register, { isLoading }] = useRegisterMutation();

    const isFormValid = name.trim() !== "" && email.includes("@") && phone.trim() !== "" && agreed && gender !== "";

    const handleSignUp = async () => {
        try {
            const fullPhone = `${selectedCountry.code}${phone}`;
            const res = await register({
                name,
                email,
                phone: fullPhone,
                gender,
                password: "Password123!",
                role: 'rider'
            }).unwrap();

            if (res.success) {
                Alert.alert("Success", "Account created! Please verify your phone number.");
                router.push({
                    pathname: "/(auth)/verify",
                    params: { email }
                });
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            Alert.alert("Error", error?.data?.message || "Something went wrong.");
        }
    };

    const genderOptions = ["Male", "Female", "Other"];
    const countries = [
        { name: "Bangladesh", flag: "🇧🇩", code: "+880" },
        { name: "United States", flag: "🇺🇸", code: "+1" },
        { name: "United Kingdom", flag: "🇬🇧", code: "+44" },
        { name: "India", flag: "🇮🇳", code: "+91" },
    ];

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

            <ScrollView style={tw`flex-1 px-8 pt-8`} showsVerticalScrollIndicator={false}>
                <Text style={tw`text-2xl font-bold text-gray-800 mb-8`}>
                    Sign up with your email or phone number
                </Text>

                <View style={tw`gap-5 pb-8`}>
                    {/* Name Input */}
                    <TextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                    />

                    {/* Email Input */}
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white`}
                        placeholderTextColor="#ccc"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* Phone Input with Country Code */}
                    <View style={tw`flex-row items-center border border-gray-200 rounded-xl bg-white`}>
                        <Pressable
                            onPress={() => setShowCountryModal(true)}
                            style={tw`flex-row items-center px-4 py-4 border-r border-gray-200`}
                        >
                            <Text style={tw`text-2xl mr-2`}>{selectedCountry.flag}</Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </Pressable>
                        <View style={tw`flex-row items-center flex-1 px-4`}>
                            <Text style={tw`text-base text-gray-800 mr-2`}>{selectedCountry.code}</Text>
                            <TextInput
                                placeholder="Your mobile number"
                                value={phone}
                                onChangeText={setPhone}
                                style={tw`flex-1 pb-2 text-base`}
                                placeholderTextColor="#ccc"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Country Modal */}
                    <Modal
                        visible={showCountryModal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowCountryModal(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setShowCountryModal(false)}
                            style={tw`flex-1 bg-black/50 justify-end`}
                        >
                            <View style={tw`bg-white rounded-t-3xl p-6`}>
                                <Text style={tw`text-xl font-bold text-gray-800 mb-6 text-center`}>Select Country</Text>
                                {countries.map((item, index) => (
                                    <Pressable
                                        key={item.code}
                                        onPress={() => {
                                            setSelectedCountry(item);
                                            setShowCountryModal(false);
                                        }}
                                        style={tw`flex-row items-center py-4 border-b border-gray-100 ${index === countries.length - 1 ? 'border-b-0' : ''}`}
                                    >
                                        <Text style={tw`text-2xl mr-4`}>{item.flag}</Text>
                                        <Text style={tw`flex-1 text-lg text-gray-700`}>{item.name}</Text>
                                        <Text style={tw`text-lg text-gray-400`}>{item.code}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    {/* Gender Selection */}
                    <Pressable
                        onPress={() => setShowGenderModal(true)}
                        style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white`}
                    >
                        <Text style={[tw`text-base`, gender ? tw`text-gray-800` : tw`text-gray-300`]}>
                            {gender || "Gender"}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                    </Pressable>

                    {/* Modal for Gender */}
                    <Modal
                        visible={showGenderModal}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowGenderModal(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setShowGenderModal(false)}
                            style={tw`flex-1 bg-black/50 justify-center items-center px-8`}
                        >
                            <View style={tw`bg-white w-full rounded-2xl p-4`}>
                                <Text style={tw`text-xl font-bold text-gray-800 mb-4 text-center`}>Select Gender</Text>
                                {genderOptions.map((option, index) => (
                                    <Pressable
                                        key={option}
                                        onPress={() => {
                                            setGender(option);
                                            setShowGenderModal(false);
                                        }}
                                        style={tw`py-4 border-b border-gray-100 ${index === genderOptions.length - 1 ? 'border-b-0' : ''}`}
                                    >
                                        <Text style={tw`text-lg text-gray-700 text-center`}>{option}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    {/* Terms and Privacy */}
                    <View style={tw`flex-row items-center`}>
                        <Pressable
                            onPress={() => setAgreed(!agreed)}
                            style={tw`w-6 h-6 rounded-full border-2 ${agreed ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-300'} items-center justify-center mr-3`}
                        >
                            {agreed && <Ionicons name="checkmark" size={16} color="white" />}
                        </Pressable>
                        <Text style={tw`flex-1 text-sm text-gray-400`}>
                            By signing up, you agree to the <Text style={tw`text-[#10B981]`}>Terms of service</Text> and <Text style={tw`text-[#10B981]`}>Privacy policy</Text>.
                        </Text>
                    </View>

                    {/* Sign Up Button */}
                    <Pressable
                        onPress={handleSignUp}
                        disabled={!isFormValid || isLoading}
                        style={tw`flex-row items-center justify-center border ${isFormValid && !isLoading ? 'border-[#10B981] bg-white' : 'border-gray-200 bg-gray-50'} py-3 rounded-xl gap-3`}
                    >
                        <Text style={[tw`font-bold text-lg`, isFormValid && !isLoading ? tw`text-[#10B981]` : tw`text-gray-300`]}>
                            {isLoading ? "Signing Up..." : "Sign Up"}
                        </Text>
                    </Pressable>
                </View>

                {/* Divider */}
                <View style={tw`flex-row items-center mb-8`}>
                    <View style={tw`flex-1 h-[1px] bg-gray-200`} />
                    <Text style={tw`mx-4 text-gray-400`}>or</Text>
                    <View style={tw`flex-1 h-[1px] bg-gray-200`} />
                </View>

                {/* Social Logins */}
                <View style={tw`gap-4 mb-10`}>
                    <Pressable
                        onPress={() => Alert.alert("Social Login", "Gmail login will be implemented soon.")}
                        style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}
                    >
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                        <Text style={tw`text-gray-700 font-medium`}>Sign up with Gmail</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => Alert.alert("Social Login", "Facebook login will be implemented soon.")}
                        style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}
                    >
                        <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                        <Text style={tw`text-gray-700 font-medium`}>Sign up with Facebook</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => Alert.alert("Social Login", "Apple login will be implemented soon.")}
                        style={tw`flex-row items-center justify-center border border-gray-200 py-3 rounded-xl gap-3`}
                    >
                        <Ionicons name="logo-apple" size={24} color="black" />
                        <Text style={tw`text-gray-700 font-medium`}>Sign up with Apple</Text>
                    </Pressable>
                </View>

                {/* Footer */}
                <View style={tw`flex-row justify-center pb-12`}>
                    <Text style={tw`text-gray-500`}>Already have an account? </Text>
                    <Pressable onPress={() => router.push("/(auth)/login")}>
                        <Text style={tw`text-[#10B981] font-bold`}>Sign in</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

