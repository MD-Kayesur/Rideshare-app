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

      <View style={tw`flex-1 bg-white`}>
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
            <View key={index} style={[tw`items-center justify-center px-10`, { width: SCREEN_WIDTH }]}>
              {/* Illustration */}
              <View style={tw`mb-20 items-center`}>
                <Image
                  source={step.image}
                  style={{ width: SCREEN_WIDTH * 0.9, height: 300 }}
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text style={tw`text-[32px] font-bold text-[#333333] text-center mb-4`}>
                {step.title}
              </Text>

              {/* Description */}
              <Text style={tw`text-base text-[#999999] text-center leading-relaxed max-w-xs`}>
                {step.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={tw`items-center justify-center pb-24`}>
          {/* Progress Button */}
          <View style={tw`items-center justify-center`}>
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                tw`w-24 h-24 rounded-full items-center justify-center relative`,
                pressed && tw`scale-95 opacity-90`
              ]}
            >
              {/* External Progress Track */}
              <View style={[
                tw`absolute inset-0 rounded-full border-[3px]`,
                { borderColor: '#E2F2E9' }
              ]} />

              {/* Progress Bar */}
              <View style={[
                tw`absolute inset-0 rounded-full border-[3px]`,
                {
                  borderColor: 'transparent',
                  borderTopColor: '#10B981',
                  borderRightColor: currentStep >= 1 ? '#10B981' : 'transparent',
                  borderBottomColor: currentStep >= 2 ? '#10B981' : 'transparent',
                  borderLeftColor: currentStep >= 2 ? '#10B981' : 'transparent',
                  transform: [{ rotate: '-45deg' }]
                }
              ]} />

              {/* Inner Circle */}
              <View
                style={[
                  tw`w-18 h-18 rounded-full bg-[#10B981] items-center justify-center shadow-sm`,
                ]}
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <Text style={tw`text-white font-bold text-lg`}>Go</Text>
                ) : (
                  <Ionicons name="arrow-forward" size={32} color="#555555" />
                )}
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}
