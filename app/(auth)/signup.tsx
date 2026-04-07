import { View, Text, Pressable, TextInput, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function SignUpScreen() {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <View style={tw`px-6 pt-6`}>
                <Pressable onPress={() => router.back()} style={tw`p-2 -ml-2`}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </Pressable>
            </View>

            <ScrollView style={tw`flex-1 px-8 pt-6`} showsVerticalScrollIndicator={false}>
                <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>Create Account</Text>
                <Text style={tw`text-base text-gray-500 mb-10`}>Start your journey with us today</Text>

                <View style={tw`gap-6 pb-10`}>
                    <View>
                        <Text style={tw`text-sm font-bold text-gray-700 mb-2 ml-1`}>FULL NAME</Text>
                        <TextInput
                            placeholder="John Doe"
                            style={tw`border-2 border-gray-100 rounded-xl px-5 py-4 text-lg`}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View>
                        <Text style={tw`text-sm font-bold text-gray-700 mb-2 ml-1`}>EMAIL</Text>
                        <TextInput
                            placeholder="example@mail.com"
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
                            tw`bg-[#10B981] py-5 rounded-xl items-center shadow-lg mt-4`,
                            pressed && tw`opacity-90`
                        ]}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Sign Up</Text>
                    </Pressable>
                </View>

                <View style={tw`flex-row justify-center pb-20`}>
                    <Text style={tw`text-gray-500`}>Already have an account? </Text>
                    <Pressable onPress={() => router.push("/(auth)/login")}>
                        <Text style={tw`text-[#10B981] font-bold`}>Log In</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
