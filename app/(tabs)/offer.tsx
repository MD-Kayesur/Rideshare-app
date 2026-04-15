import { View, Text } from "react-native";
import tw from 'twrnc';

export default function OfferScreen() {
    return (
        <View style={tw`flex-1 items-center justify-center bg-white`}>
            <Text style={tw`text-xl font-bold`}>Offer Screen</Text>
        </View>
    );
}
