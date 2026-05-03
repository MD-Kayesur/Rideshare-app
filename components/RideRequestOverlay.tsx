import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, Animated } from 'react-native';
import tw from 'twrnc';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { socketService } from '../utils/socket';
import { useAppSelector } from '../redux/hooks';
import { useAcceptRideMutation } from '../redux/features/ride/rideApi';
import { router } from 'expo-router';

export const RideRequestOverlay = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [request, setRequest] = useState<any>(null);
    const [acceptRide] = useAcceptRideMutation();
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (user?.role !== 'driver' || !user?.isOnline) return;

        socketService.on('new-ride-request', (data: any) => {
            setRequest(data);
            setTimer(30);
        });

        return () => {
            socketService.off('new-ride-request');
        };
    }, [user]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (request && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setRequest(null);
        }
        return () => clearInterval(interval);
    }, [request, timer]);

    const handleAccept = async () => {
        if (!request) return;
        try {
            await acceptRide(request._id).unwrap();
            setRequest(null);
            router.push({
                pathname: '/(pages)/request-rent',
                params: { rideId: request._id }
            } as any);
        } catch (err) {
            console.error("Accept ride failed", err);
            setRequest(null);
        }
    };

    if (!request) return null;

    return (
        <Modal transparent visible={!!request} animationType="slide">
            <View style={tw`flex-1 bg-black/50 justify-end`}>
                <View style={tw`bg-white rounded-t-3xl p-6`}>
                    <View style={tw`items-center mb-4`}>
                        <View style={tw`w-12 h-1 bg-gray-200 rounded-full`} />
                    </View>

                    <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>New Ride Request!</Text>
                    <View style={tw`flex-row items-center mb-6`}>
                        <View style={tw`bg-[#10B981]/10 px-3 py-1 rounded-full`}>
                            <Text style={tw`text-[#10B981] font-bold`}>{request.rideType.toUpperCase()}</Text>
                        </View>
                        <Text style={tw`ml-auto text-red-500 font-bold`}>{timer}s</Text>
                    </View>

                    <View style={tw`mb-6`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <View style={tw`w-8 h-8 rounded-full bg-blue-50 items-center justify-center`}>
                                <Ionicons name="location" size={20} color="#3B82F6" />
                            </View>
                            <View style={tw`ml-4 flex-1`}>
                                <Text style={tw`text-xs text-gray-400`}>PICKUP</Text>
                                <Text style={tw`text-base font-medium text-gray-800`} numberOfLines={1}>
                                    {request.pickupLocation.address}
                                </Text>
                            </View>
                        </View>

                        <View style={tw`flex-row items-center`}>
                            <View style={tw`w-8 h-8 rounded-full bg-red-50 items-center justify-center`}>
                                <Ionicons name="navigate" size={20} color="#EF4444" />
                            </View>
                            <View style={tw`ml-4 flex-1`}>
                                <Text style={tw`text-xs text-gray-400`}>DESTINATION</Text>
                                <Text style={tw`text-base font-medium text-gray-800`} numberOfLines={1}>
                                    {request.destinationLocation.address}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={tw`flex-row items-center justify-between mb-8`}>
                        <View>
                            <Text style={tw`text-xs text-gray-400`}>DISTANCE</Text>
                            <Text style={tw`text-lg font-bold text-gray-900`}>{request.distance.toFixed(1)} km</Text>
                        </View>
                        <View style={tw`items-end`}>
                            <Text style={tw`text-xs text-gray-400`}>EST. FARE</Text>
                            <Text style={tw`text-2xl font-bold text-[#10B981]`}>${request.fare}</Text>
                        </View>
                    </View>

                    <View style={tw`flex-row gap-4`}>
                        <Pressable 
                            onPress={() => setRequest(null)}
                            style={tw`flex-1 h-14 bg-gray-100 rounded-xl items-center justify-center`}
                        >
                            <Text style={tw`text-lg font-bold text-gray-500`}>Reject</Text>
                        </Pressable>
                        <Pressable 
                            onPress={handleAccept}
                            style={tw`flex-2 h-14 bg-[#10B981] rounded-xl items-center justify-center shadow-lg`}
                        >
                            <Text style={tw`text-lg font-bold text-white`}>Accept Ride</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
