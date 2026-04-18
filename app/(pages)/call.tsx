import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function CallScreen() {
    const [status, setStatus] = useState<'calling' | 'ongoing'>('calling');
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('ongoing');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let timer: any;
        if (status === 'ongoing') {
            timer = setInterval(() => {
                setSeconds((s: number) => s + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [status]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`px-6 py-4`}>
                    <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color="#374151" />
                        <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                    </Pressable>
                </View>

                {/* Content */}
                <View style={tw`flex-1 items-center justify-center -mt-20`}>
                    <View style={tw`w-40 h-40 rounded-full border-2 border-[#10B981] p-1 mb-8 shadow-sm`}>
                        <View style={tw`w-full h-full rounded-full overflow-hidden`}>
                            <Image
                                source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Sergio' }}
                                style={tw`w-full h-full`}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    <Text style={tw`text-4xl font-bold text-gray-800 mb-2`}>Sergio Ramasis</Text>
                    <Text style={tw`text-xl text-gray-400 font-medium`}>
                        {status === 'calling' ? 'Calling....' : formatTime(seconds)}
                    </Text>
                </View>

                {/* Controls */}
                <View style={tw`pb-12 px-6 flex-row items-center justify-between`}>
                    <Pressable style={tw`w-14 h-14 bg-[#E6F7F1] rounded-full items-center justify-center shadow-sm`}>
                        <Ionicons name="camera-outline" size={24} color="#10B981" />
                    </Pressable>
                    <Pressable style={tw`w-14 h-14 bg-[#E6F7F1] rounded-full items-center justify-center shadow-sm`}>
                        <Ionicons name="mic-off-outline" size={24} color="#10B981" />
                    </Pressable>

                    <Pressable
                        onPress={() => router.back()}
                        style={tw`w-20 h-20 ${status === 'calling' ? 'bg-[#10B981]' : 'bg-[#EF4444]'} rounded-full items-center justify-center shadow-lg transform scale-110`}
                    >
                        <MaterialCommunityIcons name="phone" size={40} color="white" style={tw`transform rotate-[135deg]`} />
                    </Pressable>

                    <Pressable style={tw`w-14 h-14 bg-[#E6F7F1] rounded-full items-center justify-center shadow-sm`}>
                        <Ionicons name="videocam-outline" size={24} color="#10B981" />
                    </Pressable>
                    <Pressable style={tw`w-14 h-14 bg-[#E6F7F1] rounded-full items-center justify-center shadow-sm`}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#10B981" />
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}
