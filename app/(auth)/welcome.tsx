import { View, Text, Pressable, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import tw from 'twrnc';

export default function WelcomeScreen() {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            <View style={tw`flex-1 px-8 pt-10`}>
                {/* Illustration */}
                <View style={tw`flex-1 items-center justify-center`}>
                    <View style={tw`mb-12`}>
                        <Image
                            source={require('../../assets/images/Welcome_Screen.png')}
                            style={{ width: 350, height: 280 }}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={tw`text-3xl font-bold text-[#333333] text-center mb-4`}>
                        Welcome
                    </Text>

                    <Text style={tw`text-base text-[#999999] text-center leading-relaxed`}>
                        Have a better sharing experience
                    </Text>
                </View>

                {/* Buttons Container */}
                <View style={tw`pb-12 gap-5`}>
                    <Pressable
                        onPress={() => router.push("/(auth)/signup")}
                        style={({ pressed }) => [
                            tw`bg-[#10B981] w-full py-5 rounded-xl items-center shadow-sm`,
                            pressed && tw`opacity-90`
                        ]}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Create an account</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.push("/(auth)/login")}
                        style={({ pressed }) => [
                            tw`border-2 border-[#10B981] w-full py-5 rounded-xl items-center`,
                            pressed && tw`bg-[#10B981]/5`
                        ]}
                    >
                        <Text style={tw`text-[#10B981] font-bold text-lg`}>Log In</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
