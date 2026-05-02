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
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("rider");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ name: "Bangladesh", flag: "🇧🇩", code: "+880" });
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [roleError, setRoleError] = useState("");
    const [register, { isLoading }] = useRegisterMutation();

    const validateForm = () => {
        let isValid = true;
        
        if (name.trim() === "") {
            setNameError("Name is required");
            isValid = false;
        } else {
            setNameError("");
        }

        if (!email.includes("@")) {
            setEmailError("Please enter a valid email address");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (phone.trim() === "") {
            setPhoneError("Phone number is required");
            isValid = false;
        } else {
            setPhoneError("");
        }

        if (password.length < 4) {
            setPasswordError("Password must be at least 4 characters");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        if (gender === "") {
            setGenderError("Please select your gender");
            isValid = false;
        } else {
            setGenderError("");
        }

        if (role === "") {
            setRoleError("Please select a role");
            isValid = false;
        } else {
            setRoleError("");
        }

        if (!agreed) {
            Alert.alert("Agreement Required", "You must agree to the Terms and Privacy Policy.");
            isValid = false;
        }

        return isValid;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        try {
            const fullPhone = `${selectedCountry.code}${phone}`;

            const res = await register({
                name,
                email,
                phone: fullPhone,
                gender,
                password,
                role
            }).unwrap();
            
            if (res.success) {
                Alert.alert("Success", "Account created! Please verify your email.");
                router.push({
                    pathname: "/(auth)/verify",
                    params: { 
                        email,
                        code: res.data?.verificationCode
                    }
                });
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            const errorMessage = error?.data?.message || "";
            const lowerMessage = errorMessage.toLowerCase();

            if (lowerMessage.includes("email")) {
                setEmailError(errorMessage);
            } else if (lowerMessage.includes("phone") || lowerMessage.includes("mobile")) {
                setPhoneError(errorMessage);
            } else if (lowerMessage.includes("name")) {
                setNameError(errorMessage);
            } else if (lowerMessage.includes("password")) {
                setPasswordError(errorMessage);
            } else {
                Alert.alert("Error", errorMessage || "Something went wrong.");
            }
        }
    };

    const genderOptions = ["Male", "Female", "Other"];
    const roleOptions = [
        { label: "Rider", value: "rider" },
        { label: "Driver", value: "driver" }
    ];
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
                    <View>
                        <TextInput
                            placeholder="Name"
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                setNameError("");
                            }}
                            style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white ${nameError ? 'border-red-500' : ''}`}
                            placeholderTextColor="#ccc"
                        />
                        {nameError ? <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{nameError}</Text> : null}
                    </View>

                    {/* Email Input */}
                    <View>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setEmailError("");
                            }}
                            style={tw`border border-gray-200 rounded-xl px-4 py-4 text-base bg-white ${emailError ? 'border-red-500' : ''}`}
                            placeholderTextColor="#ccc"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {emailError ? <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{emailError}</Text> : null}
                    </View>

                    {/* Phone Input with Country Code */}
                    <View>
                        <View style={tw`flex-row items-center border border-gray-200 rounded-xl bg-white ${phoneError ? 'border-red-500' : ''}`}>
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
                                    onChangeText={(text) => {
                                        setPhone(text);
                                        setPhoneError("");
                                    }}
                                    style={tw`flex-1 pb-2 text-base`}
                                    placeholderTextColor="#ccc"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                        {phoneError ? <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{phoneError}</Text> : null}
                    </View>

                    {/* Password Input */}
                    <View>
                        <View style={tw`flex-row items-center border border-gray-200 rounded-xl px-4 bg-white ${passwordError ? 'border-red-500' : ''}`}>
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setPasswordError("");
                                }}
                                style={tw`flex-1 py-4 text-base`}
                                placeholderTextColor="#ccc"
                                secureTextEntry={!showPassword}
                            />
                            <Pressable onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={24} 
                                    color="#999" 
                                />
                            </Pressable>
                        </View>
                        {passwordError ? <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{passwordError}</Text> : null}
                    </View>

                    {/* Confirm Password Input */}
                    <View>
                        <View style={tw`flex-row items-center border border-gray-200 rounded-xl px-4 bg-white ${confirmPasswordError ? 'border-red-500' : ''}`}>
                            <TextInput
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setConfirmPasswordError("");
                                }}
                                style={tw`flex-1 py-4 text-base`}
                                placeholderTextColor="#ccc"
                                secureTextEntry={!showConfirmPassword}
                            />
                            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons 
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={24} 
                                    color="#999" 
                                />
                            </Pressable>
                        </View>
                        {confirmPasswordError ? <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{confirmPasswordError}</Text> : null}
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
                    <View>
                        <Pressable
                            onPress={() => setShowGenderModal(true)}
                            style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white ${genderError ? 'border-red-500' : ''}`}
                        >
                            <Text style={[tw`text-base`, gender ? tw`text-gray-800` : tw`text-gray-300`]}>
                                {gender || "Gender"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </Pressable>
                        {genderError ? <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{genderError}</Text> : null}
                    </View>

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
                                                setGenderError("");
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

                    {/* Role Selection */}
                    <View>
                        <Pressable
                            onPress={() => setShowRoleModal(true)}
                            style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white ${roleError ? 'border-red-500' : ''}`}
                        >
                            <Text style={[tw`text-base`, role ? tw`text-gray-800` : tw`text-gray-300`]}>
                                {roleOptions.find(opt => opt.value === role)?.label || "Select Role"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </Pressable>
                        {roleError ? <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{roleError}</Text> : null}
                    </View>

                    {/* Modal for Role */}
                    <Modal
                        visible={showRoleModal}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowRoleModal(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setShowRoleModal(false)}
                            style={tw`flex-1 bg-black/50 justify-center items-center px-8`}
                        >
                            <View style={tw`bg-white w-full rounded-2xl p-4`}>
                                <Text style={tw`text-xl font-bold text-gray-800 mb-4 text-center`}>Select Role</Text>
                                {roleOptions.map((option, index) => (
                                    <Pressable
                                        key={option.value}
                                            onPress={() => {
                                                setRole(option.value);
                                                setRoleError("");
                                                setShowRoleModal(false);
                                            }}
                                        style={tw`py-4 border-b border-gray-100 ${index === roleOptions.length - 1 ? 'border-b-0' : ''}`}
                                    >
                                        <Text style={tw`text-lg text-gray-700 text-center`}>{option.label}</Text>
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
                        disabled={isLoading}
                        style={tw`flex-row items-center justify-center border ${!isLoading ? 'border-[#10B981] bg-white' : 'border-gray-200 bg-gray-50'} py-3 rounded-xl gap-3`}
                    >
                        <Text style={[tw`font-bold text-lg`, !isLoading ? tw`text-[#10B981]` : tw`text-gray-300`]}>
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

