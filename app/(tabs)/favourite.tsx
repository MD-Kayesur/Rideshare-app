import { View, Text } from "react-native";
import tw from 'twrnc';

export default function FavouritesScreen() {
    return (
        <View style={tw`flex-1 items-center justify-center bg-white`}>
            <Text style={tw`text-xl font-bold`}>Favourites Screen</Text>
        </View>
    );
}
