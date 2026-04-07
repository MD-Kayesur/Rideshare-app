import {
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import React, { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import tw from 'twrnc';
import { Image } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: "Anywhere you are",
      description: "Sell houses easily with the help of Listenoryx and to make this line big I am writing more.",
      image: require('../assets/images/Anywhere_you_are.png'),
    },
    {
      title: "At anytime",
      description: "Sell houses easily with the help of Listenoryx and to make this line big I am writing more.",
      image: require('../assets/images/At_anytime.png'),
    },
    {
      title: "Book your car",
      description: "Sell houses easily with the help of Listenoryx and to make this line big I am writing more.",
      image: require('../assets/images/Frame 1.png'),
    }
  ];

  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({ x: nextStep * SCREEN_WIDTH, animated: true });
    } else {
      router.push("/(pages)/location");
    }
  };

  const handleSkip = () => {
    router.push("/(tabs)");
  };

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== currentStep) {
      setCurrentStep(roundIndex);
    }
  };

  return (
    <SafeScreen>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={tw`flex-1 bg-white relative`}>
        {/* Skip Button */}
        <Pressable
          onPress={handleSkip}
          style={tw`absolute top-12 right-6 z-10`}
        >
          <Text style={tw`text-gray-500 font-bold text-lg`}>Skip</Text>
        </Pressable>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          scrollEventThrottle={16}
          style={tw`flex-1`}
        >
          {onboardingSteps.map((step, index) => (
            <View key={index} style={[tw`items-center justify-center px-6`, { width: SCREEN_WIDTH }]}>
              {/* Illustration */}
              <View style={tw`mb-12 items-center`}>
                <Image
                  source={step.image}
                  style={{ width: 350, height: 250 }}
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text style={tw`text-3xl font-black text-gray-900 text-center mb-4`}>
                {step.title}
              </Text>

              {/* Description */}
              <Text style={tw`text-base text-gray-500 text-center leading-relaxed mb-16 max-w-xs`}>
                {step.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={tw`items-center justify-center pb-12`}>
          {/* Progress Button */}
          <View style={tw`items-center justify-center`}>
            {/* Fully Clickable Progress Area */}
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                tw`w-24 h-24 rounded-full border-4 items-center justify-center relative`,
                { borderColor: '#F3F4F6' },
                pressed && tw`scale-95 opacity-90`
              ]}
            >
              {/* Dynamic Border Overlay (Simulation) */}
              <View style={[
                tw`absolute inset-0 rounded-full border-4`,
                {
                  borderColor: 'transparent',
                  borderTopColor: '#10B981',
                  borderRightColor: currentStep >= 1 ? '#10B981' : 'transparent',
                  borderBottomColor: currentStep >= 2 ? '#10B981' : 'transparent',
                  borderLeftColor: currentStep >= 2 ? '#10B981' : 'transparent',
                  transform: [{ rotate: '-45deg' }]
                }
              ]} />

              <View
                style={tw`w-18 h-18 rounded-full bg-[#10B981] items-center justify-center shadow-lg`}
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <Text style={tw`text-white font-black text-lg`}>Go</Text>
                ) : (
                  <Ionicons name="arrow-forward" size={32} color="white" />
                )}
              </View>
            </Pressable>
          </View>

          {/* Bottom indicator dots */}
          <View style={tw`flex-row justify-center gap-2 mt-8`}>
            {onboardingSteps.map((_, i) => (
              <View
                key={i}
                style={[
                  tw`h-1.5 rounded-full bg-gray-200`,
                  currentStep === i ? tw`w-6 bg-[#10B981]` : tw`w-1.5`
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}
