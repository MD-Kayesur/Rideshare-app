import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, ScrollView, TextInput, StatusBar, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import { useCreateRideMutation, useGetSingleRideQuery, useAcceptRideMutation, useStartRideMutation, useCompleteRideMutation, useCancelRideMutation, useRateRideMutation } from '../../redux/features/ride/rideApi';
import { socketService } from '../../utils/socket';
import { useAppSelector } from '../../redux/hooks';

const paymentMethods = [
    { id: '1', type: 'visa', label: '**** **** **** 8970', expires: 'Expires: 12/26', icon: 'cc-visa' },
    { id: '2', type: 'mastercard', label: '**** **** **** 8970', expires: 'Expires: 12/26', icon: 'cc-mastercard' },
    { id: '3', type: 'paypal', label: 'mailaddress@mail.com', expires: 'Expires: 12/26', icon: 'paypal' },
    { id: '4', type: 'cash', label: 'Cash', expires: 'Expires: 12/26', icon: 'money' },
];

export default function RequestRentScreen() {
    const { name, rideId: initialRideId } = useLocalSearchParams();
    const user = useAppSelector(state => state.auth.user);
    const [rideId, setRideId] = useState<string | null>((initialRideId as string) || null);
    
    const { data: rideResponse, refetch: refetchRide } = useGetSingleRideQuery(rideId, {
        skip: !rideId,
        pollingInterval: 5000, 
    });
    const ride = rideResponse?.data || rideResponse;

    const [selectedPayment, setSelectedPayment] = useState('1');
    const [step, setStep] = useState(0); 
    const [modalStep, setModalStep] = useState<null | 'success' | 'feedback' | 'final' | 'requesting'>(null);
    const [selectedTip, setSelectedTip] = useState('$2');
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    const [otp, setOtp] = useState('');

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [createRide, { isLoading: isCreatingRide }] = useCreateRideMutation();
    const [startRide] = useStartRideMutation();
    const [completeRide] = useCompleteRideMutation();
    const [cancelRide] = useCancelRideMutation();
    const [rateRide] = useRateRideMutation();

    useEffect(() => {
        if (rideId) {
            socketService.on('ride-accepted', () => refetchRide());
            socketService.on('ride-started', () => refetchRide());
            socketService.on('ride-completed', () => {
                refetchRide();
                setModalStep('success');
            });
            socketService.on('ride-cancelled', () => {
                Alert.alert("Ride Cancelled", "This ride has been cancelled.");
                router.replace('/(tabs)');
            });
        }
        return () => {
            socketService.off('ride-accepted');
            socketService.off('ride-started');
            socketService.off('ride-completed');
            socketService.off('ride-cancelled');
        };
    }, [rideId]);

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        if (Platform.OS === 'android') setShowTimePicker(false);
        if (selectedTime) setTime(selectedTime);
    };

    const formatDate = (date: Date) => date.toLocaleDateString();
    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const carDisplayName = ride?.rideType || (typeof name === 'string' ? name : 'Car');
    const carFirstName = carDisplayName.split(' ')[0];

    const vehicleImages: any = {
        'car': require('../../assets/images/mustang.png'),
        'bike': require('../../assets/images/motorcycle_render.png'),
        'cycle': require('../../assets/images/bicycle_render.png'),
        'cng': require('../../assets/images/taxi_render.png'),
    };

    const currentImage = vehicleImages[ride?.rideType || carFirstName.toLowerCase()] || vehicleImages['car'];

    const handleAction = async () => {
        if (!rideId) return;
        try {
            if (ride.status === 'accepted') {
                if (!otp || otp.length !== 4) {
                    Alert.alert("Error", "Please enter the 4-digit OTP from rider.");
                    return;
                }
                await startRide({ id: rideId, otp }).unwrap();
                Alert.alert("Success", "Trip started!");
            } else if (ride.status === 'ongoing') {
                await completeRide(rideId).unwrap();
            }
        } catch (err: any) {
            Alert.alert("Error", err?.data?.message || "Action failed");
        }
    };

    const handleNextStep = async () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1) {
            try {
                const rideData = {
                    pickupLocation: {
                        coordinates: [90.4125, 23.8103], // Mock coordinates for "Current location"
                        address: "2972 Westheimer Rd. Santa Ana, Illinois 85486"
                    },
                    destinationLocation: {
                        coordinates: [90.4043, 23.7940], // Mock coordinates for "Office"
                        address: "1901 Thornridge Cir. Shiloh, Hawaii 81063"
                    },
                    fare: 220,
                    distance: 1.1,
                    duration: 10,
                    rideType: carFirstName.toLowerCase().includes('bike') ? 'bike' : 'car'
                };

                const res = await createRide(rideData).unwrap();
                if (res.success) {
                    setRideId(res.data?._id);
                    setModalStep('requesting');
                }
            } catch (error: any) {
                console.error('Ride creation error:', error);
                Alert.alert("Error", error?.data?.message || "Failed to request ride. Please try again.");
            }
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        } else {
            router.back();
        }
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row items-center px-6 py-4`}>
                    <Pressable onPress={handleBack} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color="#374151" />
                        <Text style={tw`text-lg text-gray-700 ml-1`}>Back</Text>
                    </Pressable>
                    {step !== 2 && (
                        <Text style={tw`text-xl font-bold text-gray-800 flex-1 text-center mr-10`}>
                            {step === 1 ? 'Payment' : 'Request for rent'}
                        </Text>
                    )}
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-32 px-6`}>
                    {/* Ride Status Header */}
                    {rideId && ride && (
                        <View style={tw`bg-[#10B981]/10 rounded-2xl p-4 mb-6`}>
                            <Text style={tw`text-[#10B981] font-bold text-center text-lg`}>
                                {ride.status === 'pending' && 'Searching for Drivers...'}
                                {ride.status === 'accepted' && 'Driver is on the way'}
                                {ride.status === 'ongoing' && 'Trip in Progress'}
                                {ride.status === 'completed' && 'Trip Completed'}
                            </Text>
                        </View>
                    )}

                    {/* Route Info */}
                    {!rideId || ride?.status === 'pending' ? (
                        <View style={tw`mt-6 mb-8`}>
                            <View style={tw`flex-row items-start mb-6`}>
                                <View style={tw`items-center mr-4 pt-1`}>
                                    <Ionicons name="location" size={24} color="#EF4444" />
                                    <View style={tw`w-0.5 h-10 border-l border-dashed border-[#10B981] my-1`} />
                                </View>
                                <View>
                                    <Text style={tw`text-lg font-bold text-gray-800`}>Current location</Text>
                                    <Text style={tw`text-gray-400 text-sm`}>{ride?.pickupLocation?.address || "2972 Westheimer Rd. Santa Ana, Illinois"}</Text>
                                </View>
                            </View>
                            <View style={tw`flex-row items-start`}>
                                <View style={tw`items-center mr-4`}>
                                    <Ionicons name="location" size={24} color="#10B981" />
                                </View>
                                <View style={tw`flex-1 flex-row justify-between items-center`}>
                                    <View>
                                        <Text style={tw`text-lg font-bold text-gray-800`}>Destination</Text>
                                        <Text style={tw`text-gray-400 text-sm`}>{ride?.destinationLocation?.address || "1901 Thornridge Cir. Shiloh, Hawaii"}</Text>
                                    </View>
                                    <Text style={tw`text-gray-800 font-bold`}>{ride?.distance || "1.1"}km</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        /* Driver Details & OTP */
                        <View style={tw`mb-8`}>
                            <View style={tw`flex-row items-center bg-gray-50 rounded-2xl p-4 mb-4`}>
                                <Image 
                                    source={ride.driver?.avatar ? { uri: ride.driver.avatar } : require('../../assets/images/image.png')} 
                                    style={tw`w-16 h-16 rounded-full bg-blue-100`} 
                                />
                                <View style={tw`ml-4 flex-1`}>
                                    <Text style={tw`text-lg font-bold text-gray-800`}>{ride.driver?.name || "Driver"}</Text>
                                    <Text style={tw`text-gray-400`}>{ride.rideType.toUpperCase()}</Text>
                                </View>
                                <View style={tw`flex-row gap-2`}>
                                    <Pressable style={tw`w-10 h-10 rounded-full bg-[#E6F7F1] items-center justify-center`}>
                                        <Ionicons name="call" size={20} color="#10B981" />
                                    </Pressable>
                                    <Pressable 
                                        onPress={() => router.push('/(pages)/chat')}
                                        style={tw`w-10 h-10 rounded-full bg-[#E6F7F1] items-center justify-center`}
                                    >
                                        <Ionicons name="chatbubble-ellipses" size={20} color="#10B981" />
                                    </Pressable>
                                </View>
                            </View>

                            {/* OTP Section */}
                            {user?.role === 'rider' && ride.status === 'accepted' && (
                                <View style={tw`items-center bg-yellow-50 rounded-2xl p-6`}>
                                    <Text style={tw`text-gray-500 mb-2`}>Share this OTP with Driver</Text>
                                    <Text style={tw`text-4xl font-bold tracking-[8px] text-gray-800`}>{ride.otp}</Text>
                                </View>
                            )}

                            {user?.role === 'driver' && ride.status === 'accepted' && (
                                <View style={tw`bg-gray-50 rounded-2xl p-6`}>
                                    <Text style={tw`text-gray-500 mb-2 text-center`}>Enter Rider's OTP to Start Trip</Text>
                                    <TextInput 
                                        style={tw`bg-white border border-gray-200 rounded-xl h-14 text-center text-2xl font-bold`}
                                        placeholder="0 0 0 0"
                                        maxLength={4}
                                        keyboardType="number-pad"
                                        value={otp}
                                        onChangeText={setOtp}
                                    />
                                </View>
                            )}
                        </View>
                    )}

                    {/* Car Summary (Only during booking) */}
                    {!rideId && (
                        <View style={tw`${step === 1 ? 'mt-6' : ''} bg-[#E6F7F1]/50 border border-[#10B981]/10 rounded-2xl p-4 flex-row items-center mb-8 shadow-sm`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{carDisplayName}</Text>
                                <View style={tw`flex-row items-center`}>
                                    <Ionicons name="star" size={16} color="#FBBF24" />
                                    <Text style={tw`ml-1 text-gray-800 font-medium text-xs`}>4.9 <Text style={tw`text-gray-400 font-normal`}>(531 reviews)</Text></Text>
                                </View>
                            </View>
                            <Image source={currentImage} style={tw`w-24 h-14`} resizeMode="contain" />
                        </View>
                    )}

                    {step === 0 ? (
                        /* Step 0: Date & Time Inputs */
                        <View style={tw`gap-4 mb-8`}>
                            <Pressable 
                                onPress={() => setShowDatePicker(prev => !prev)}
                                style={tw`bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row items-center justify-between`}
                            >
                                <Text style={tw`text-base ${date ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {date ? formatDate(date) : 'Date'}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color="#10B981" />
                            </Pressable>

                            <Pressable 
                                onPress={() => setShowTimePicker(prev => !prev)}
                                style={tw`bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row items-center justify-between`}
                            >
                                <Text style={tw`text-base ${time ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {time ? formatTime(time) : 'Time'}
                                </Text>
                                <Ionicons name="time-outline" size={20} color="#10B981" />
                            </Pressable>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                                    onChange={onDateChange}
                                />
                            )}

                            {showTimePicker && (
                                <DateTimePicker
                                    value={time}
                                    mode="time"
                                    is24Hour={true}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                                    onChange={onTimeChange}
                                />
                            )}
                        </View>
                    ) : (
                        /* Step 1: Charge Section */
                        <View style={tw`mt-2 mb-8`}>
                            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Charge</Text>
                            <View style={tw`flex-row justify-between items-center mb-4`}>
                                <Text style={tw`text-gray-400 font-medium text-base`}>{carFirstName}/per hours</Text>
                                <Text style={tw`text-gray-800 font-bold text-base`}>$200</Text>
                            </View>
                            <View style={tw`flex-row justify-between items-center mb-6`}>
                                <Text style={tw`text-gray-400 font-medium text-base`}>Vat (5%)</Text>
                                <Text style={tw`text-gray-800 font-bold text-base`}>$20</Text>
                            </View>
                            <View style={tw`h-[1px] bg-gray-100 mb-6`} />
                            <View style={tw`flex-row justify-between items-center`}>
                                <Text style={tw`text-gray-500 font-bold text-lg`}>Total</Text>
                                <Text style={tw`text-gray-800 font-bold text-lg`}>$220</Text>
                            </View>
                        </View>
                    )}

                    {/* Payment Method */}
                    <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Select payment method</Text>
                    {paymentMethods.map((method) => (
                        <Pressable
                            key={method.id}
                            onPress={() => setSelectedPayment(method.id)}
                            style={tw`flex-row items-center bg-white border ${selectedPayment === method.id ? 'border-[#10B981]' : 'border-gray-100'} rounded-2xl p-5 mb-4 shadow-sm`}
                        >
                            <View style={tw`w-12 h-10 items-center justify-center mr-4`}>
                                <FontAwesome name={method.icon as any} size={28} color={method.type === 'visa' ? '#1A1F71' : method.type === 'mastercard' ? '#EB001B' : method.type === 'paypal' ? '#0070BA' : '#4B5563'} />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-800 font-bold text-base`}>{method.label}</Text>
                                <Text style={tw`text-gray-400 text-xs mt-0.5`}>{method.expires}</Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Bottom Action */}
                <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-100`}>
                    {!rideId ? (
                        <Pressable
                            onPress={handleNextStep}
                            disabled={isCreatingRide}
                            style={tw`bg-[#10B981] py-4.5 rounded-2xl items-center shadow-lg ${isCreatingRide ? 'opacity-50' : ''}`}
                        >
                            <Text style={tw`text-white font-bold text-xl`}>
                                {isCreatingRide ? 'Requesting...' : step === 0 ? 'Confirm Booking' : 'Confirm Ride'}
                            </Text>
                        </Pressable>
                    ) : ride?.status === 'pending' ? (
                        <View style={tw`flex-row gap-4`}>
                            <Pressable 
                                onPress={() => {
                                    cancelRide(rideId);
                                    router.replace('/(tabs)');
                                }}
                                style={tw`flex-1 py-4.5 rounded-2xl items-center border border-red-500`}
                            >
                                <Text style={tw`text-red-500 font-bold text-lg`}>Cancel</Text>
                            </Pressable>
                            <View style={tw`flex-2 bg-gray-100 py-4.5 rounded-2xl items-center`}>
                                <Text style={tw`text-gray-400 font-bold text-lg`}>Waiting for Driver...</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={tw`flex-row gap-4`}>
                            {user?.role === 'driver' ? (
                                <Pressable
                                    onPress={handleAction}
                                    style={tw`flex-1 bg-[#10B981] py-4.5 rounded-2xl items-center shadow-lg`}
                                >
                                    <Text style={tw`text-white font-bold text-lg`}>
                                        {ride?.status === 'accepted' ? 'Start Trip' : 'Complete Trip'}
                                    </Text>
                                </Pressable>
                            ) : (
                                <View style={tw`flex-1 bg-gray-100 py-4.5 rounded-2xl items-center`}>
                                    <Text style={tw`text-gray-400 font-bold text-lg`}>Trip in Progress...</Text>
                                </View>
                            )}
                            <Pressable 
                                onPress={() => {
                                    cancelRide(rideId);
                                    router.replace('/(tabs)');
                                }}
                                style={tw`w-16 h-14 bg-red-50 rounded-2xl items-center justify-center`}
                            >
                                <Ionicons name="close-circle-outline" size={28} color="#EF4444" />
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Modal Overlays */}
                {modalStep && (
                    <View style={tw`absolute inset-0 bg-black/50 items-center justify-center z-50 px-6`}>
                        <View style={tw`bg-white w-full rounded-[32px] p-6 shadow-2xl relative overflow-hidden`}>
                            {/* Close Icon */}
                            <Pressable
                                onPress={() => setModalStep(null)}
                                style={tw`absolute top-4 right-4 z-10 p-2`}
                            >
                                <Ionicons name="close" size={24} color="#9CA3AF" />
                            </Pressable>

                            {/* Modal Header Icon */}
                            <View style={tw`items-center mt-4 mb-6`}>
                                <View style={tw`w-24 h-24 items-center justify-center`}>
                                    <MaterialCommunityIcons name="decagram" size={100} color="#E6F7F1" style={tw`absolute`} />
                                    <Ionicons name="checkmark" size={44} color="#10B981" style={tw`z-10`} />
                                </View>
                            </View>

                            {modalStep === 'requesting' && (
                                <View style={tw`items-center py-6`}>
                                    <MaterialCommunityIcons name="car-search" size={80} color="#10B981" />
                                    <Text style={tw`text-2xl font-bold text-gray-800 mt-4 mb-2`}>Finding a Driver</Text>
                                    <Text style={tw`text-gray-400 text-center text-base mb-6`}>
                                        We are connecting you with the best available drivers nearby...
                                    </Text>
                                    <ActivityIndicator size="large" color="#10B981" />
                                </View>
                            )}

                            {modalStep === 'success' && (
                                <View style={tw`items-center`}>
                                    <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Trip Completed</Text>
                                    <Text style={tw`text-gray-400 text-center text-base mb-6`}>
                                        The trip has been successfully completed by{"\n"}{user?.role === 'rider' ? (ride?.driver?.name || 'your driver') : (ride?.rider?.name || 'your rider')}
                                    </Text>
                                    <View style={tw`items-center mb-8`}>
                                        <Text style={tw`text-gray-500 font-bold text-sm mb-1`}>Fare Amount</Text>
                                        <Text style={tw`text-4xl font-bold text-gray-800`}>${ride?.fare || '0'}</Text>
                                    </View>

                                    <View style={tw`w-full h-[1px] bg-gray-100 border-t border-dashed border-gray-300 mb-6`} />

                                    <Text style={tw`text-gray-800 font-bold text-lg mb-2`}>How is your trip?</Text>
                                    <Text style={tw`text-gray-400 text-center text-sm mb-6 px-4`}>
                                        Your feedback will help us to improve your driving experience better
                                    </Text>

                                    {/* Action row with Chat/Call buttons */}
                                    <View style={tw`flex-row gap-4 mb-6`}>
                                        <Pressable
                                            onPress={() => router.push('/(pages)/chat')}
                                            style={tw`flex-1 h-14 bg-[#E6F7F1]/50 border border-[#10B981]/10 rounded-xl items-center justify-center flex-row gap-2`}
                                        >
                                            <Ionicons name="chatbubble-ellipses" size={20} color="#10B981" />
                                            <Text style={tw`text-[#10B981] font-bold`}>Chat</Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => router.push('/(pages)/call')}
                                            style={tw`flex-1 h-14 bg-[#E6F7F1]/50 border border-[#10B981]/10 rounded-xl items-center justify-center flex-row gap-2`}
                                        >
                                            <Ionicons name="call" size={20} color="#10B981" />
                                            <Text style={tw`text-[#10B981] font-bold`}>Call</Text>
                                        </Pressable>
                                    </View>

                                    <Pressable
                                        onPress={() => setModalStep('feedback')}
                                        style={tw`bg-[#10B981] w-full py-4.5 rounded-2xl items-center mb-2 shadow-md`}
                                    >
                                        <Text style={tw`text-white font-bold text-lg`}>Please Feedback</Text>
                                    </Pressable>
                                </View>
                            )}

                            {modalStep === 'feedback' && (
                                <View style={tw`items-center`}>
                                    <View style={tw`flex-row gap-3 mb-6`}>
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Pressable key={s} onPress={() => setRating(s)}>
                                                <Ionicons name="star" size={32} color={s <= rating ? "#FBBF24" : "#D1D5DB"} />
                                            </Pressable>
                                        ))}
                                    </View>
                                    <Text style={tw`text-2xl font-bold text-[#10B981] mb-2`}>
                                        {rating === 5 ? 'Excellent' : rating >= 3 ? 'Good' : 'Needs Improvement'}
                                    </Text>
                                    <Text style={tw`text-gray-400 text-center text-sm mb-6`}>
                                        You rated {user?.role === 'rider' ? ride?.driver?.name : ride?.rider?.name} {rating} star
                                    </Text>

                                    <TextInput
                                        placeholder="Write your feedback..."
                                        placeholderTextColor="#D1D5DB"
                                        value={feedback}
                                        onChangeText={setFeedback}
                                        multiline
                                        style={tw`w-full bg-white border border-gray-100 rounded-2xl px-4 py-4 h-28 text-base text-gray-800 mb-6`}
                                    />

                                    <Text style={tw`text-gray-700 font-bold text-lg mb-6`}>
                                        Give some tips to {user?.role === 'rider' ? ride?.driver?.name : ride?.rider?.name}
                                    </Text>

                                    <View style={tw`flex-row flex-wrap justify-between gap-3 mb-8`}>
                                        {['$1', '$2', '$5', '$10', '$20'].map((tip) => (
                                            <Pressable
                                                key={tip}
                                                onPress={() => setSelectedTip(tip)}
                                                style={tw`flex-1 min-w-[17%] aspect-[4/3] bg-white border ${selectedTip === tip ? 'border-[#10B981]' : 'border-gray-100'} rounded-xl items-center justify-center`}
                                            >
                                                <Text style={tw`text-lg font-bold ${selectedTip === tip ? 'text-gray-800' : 'text-gray-400'}`}>{tip}</Text>
                                            </Pressable>
                                        ))}
                                    </View>

                                    <Pressable
                                        onPress={async () => {
                                            try {
                                                await rateRide({ id: rideId, rating, feedback }).unwrap();
                                                setModalStep('final');
                                            } catch (err) {
                                                Alert.alert("Error", "Failed to submit rating");
                                            }
                                        }}
                                        style={tw`bg-[#10B981] w-full py-4.5 rounded-2xl items-center mb-2 shadow-md`}
                                    >
                                        <Text style={tw`text-white font-bold text-lg`}>Submit</Text>
                                    </Pressable>
                                </View>
                            )}

                            {modalStep === 'final' && (
                                <View style={tw`items-center`}>
                                    <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>Thank you</Text>
                                    <Text style={tw`text-gray-400 text-center text-base mb-10 px-4`}>
                                        Thank you for your valuable feedback and tip
                                    </Text>
                                    <Pressable
                                        onPress={() => {
                                            setModalStep(null);
                                            router.dismissAll();
                                            router.replace('/(tabs)');
                                        }}
                                        style={tw`bg-[#10B981] w-full py-4.5 rounded-2xl items-center mb-4 shadow-md`}
                                    >
                                        <Text style={tw`text-white font-bold text-lg`}>Back Home</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}
