import { View, Text, Pressable, TextInput, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function LoginScreen() {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <View style={tw`px-6 pt-6`}>
                <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </Pressable>
            </View>

            <View style={tw`flex-1 px-8 pt-10`}>
                <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>Welcome Back</Text>
                <Text style={tw`text-base text-gray-500 mb-10`}>Sign in to continue your journey</Text>

                <View style={tw`gap-6`}>
                    <View>
                        <Text style={tw`text-sm font-bold text-gray-700 mb-2 ml-1`}>EMAIL</Text>
                        <TextInput
                            placeholder="Enter your email"
                            style={tw`border-2 border-gray-100 rounded-xl px-5 py-4 text-lg`}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View>
                        <Text style={tw`text-sm font-bold text-gray-700 mb-2 ml-1`}>PASSWORD</Text>
                        <TextInput
                            placeholder="••••••••"
                            secureTextEntry
                            style={tw`border-2 border-gray-100 rounded-xl px-5 py-4 text-lg`}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            tw`bg-[#10B981] py-5 rounded-xl items-center shadow-lg mt-8`,
                            pressed && tw`opacity-90`
                        ]}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Log In</Text>
                    </Pressable>
                </View>

                <View style={tw`flex-row justify-center mt-auto pb-10`}>
                    <Text style={tw`text-gray-500`}>Don't have an account? </Text>
                    <Pressable onPress={() => router.push("/(auth)/signup")}>
                        <Text style={tw`text-[#10B981] font-bold`}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
