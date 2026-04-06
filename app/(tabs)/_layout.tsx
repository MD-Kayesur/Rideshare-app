import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import ExpandableTabButton from "@/components/ExpandableTabButton";
import { View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        // Tab icon with custom active color
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "about") {
            return <ExpandableTabButton size={size} focused={focused} />;
          }

          let iconName: keyof typeof Ionicons.glyphMap = "call";
          if (route.name === "contact") iconName = "call";

          if (focused) {
            // Active: red gradient with white outline
            return (
              <View
                style={{
                  borderRadius: 50,
                  padding: 2,
                  backgroundColor: "white",
                }}
              >
                <LinearGradient
                  colors={["#FF4D4D", "#FF0000"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{
                    borderRadius: 50,
                    width: size + 4,
                    height: size + 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name={iconName} size={size} color="white" />
                </LinearGradient>
              </View>
            );
          }

          // Inactive: white
          return <Ionicons name={iconName} size={size} color="white" />;
        },

        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 20,
          overflow: "hidden",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: "transparent", // blur behind
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: "white",
        },
      })}
    >
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              tint="dark"
              className="absolute inset-0 bg-black/70"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              tint="dark"
              className="absolute inset-0 bg-black/70"
            />
          ),
        }}
      />
    </Tabs>
  );
}
